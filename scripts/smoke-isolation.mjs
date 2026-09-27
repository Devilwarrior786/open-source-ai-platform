// Authorization isolation test: verifies thread ownership checks.
//  - User A creates a thread
//  - User B must NOT read A's thread or messages, and must NOT send messages into it
//
// Usage: node scripts/smoke-isolation.mjs   (reads VITE_CONVEX_URL from .env.local)
import { readFileSync } from "node:fs";

const env = readFileSync(".env.local", "utf8");
const url = env.match(/^VITE_CONVEX_URL="?([^"\n]+)"?$/m)?.[1];
if (!url) throw new Error("VITE_CONVEX_URL not found in .env.local");

const { ConvexHttpClient } = await import("convex/browser");
const { anyApi } = await import("convex/server");

const client = new ConvexHttpClient(url);
const stamp = Date.now();

async function signUp(email) {
  const res = await client.action(anyApi.auth.signIn, {
    provider: "password",
    params: { flow: "signUp", email, password: "correct-horse-battery" },
  });
  client.setAuth(res.tokens.token);
  return res;
}

// User A: create a thread.
await signUp(`iso-a-${stamp}@openforge.test`);
const { threadId } = await client.mutation(anyApi.chat.sendMessage, {
  content: "A's private thread",
});
if (!threadId) throw new Error("A could not create thread");
console.log("A created thread: ok", { threadId });

// Switch the same HTTP client to user B.
await signUp(`iso-b-${stamp}@openforge.test`);
console.log("B signed in: ok");

// 1. B must not read A's messages.
const bMessages = await client.query(anyApi.threads.listMessages, { threadId });
if (bMessages !== null) throw new Error(`B could read A's messages (${bMessages.length})`);
console.log("B cannot read A's messages: ok");

// 2. B must not see A's thread in their list.
const bThreads = await client.query(anyApi.threads.list, {});
if (bThreads.some((t) => t._id === threadId)) throw new Error("B sees A's thread in list");
console.log("B cannot list A's thread: ok");

// 3. B must not append messages into A's thread.
let blocked = false;
try {
  await client.mutation(anyApi.chat.sendMessage, { threadId, content: "intrusion" });
} catch {
  blocked = true;
}
if (!blocked) throw new Error("B was able to write into A's thread");
console.log("B cannot write into A's thread: ok");

console.log("ISOLATION TEST PASSED");
