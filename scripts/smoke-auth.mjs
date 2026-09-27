// E2E smoke test for OpenForge:
//  1. Sign up through Convex Auth's signIn action (same path the browser uses)
//  2. Confirm the user row exists (with name)
//  3. Sign in with the same credentials
//  4. Authenticated chat flow: send a message, wait for the scheduled AI reply,
//     and verify the thread + both messages persisted.
//
// Usage: node scripts/smoke-auth.mjs   (reads VITE_CONVEX_URL from .env.local)
import { readFileSync } from "node:fs";

const env = readFileSync(".env.local", "utf8");
const url = env.match(/^VITE_CONVEX_URL="?([^"\n]+)"?$/m)?.[1];
if (!url) throw new Error("VITE_CONVEX_URL not found in .env.local");

const { ConvexHttpClient } = await import("convex/browser");
const { anyApi } = await import("convex/server");

const client = new ConvexHttpClient(url);

const email = `smoke-${Date.now()}@openforge.test`;
const password = "correct-horse-battery";

// 1. Sign up.
const signUp = await client.action(anyApi.auth.signIn, {
  provider: "password",
  params: { flow: "signUp", email, password, name: "Smoke Tester" },
});
console.log("signUp: ok");

// 2. Confirm the user row exists.
const users = await client.query(anyApi.users.debugListUsers, {});
const found = users.find((u) => u.email === email);
if (!found) throw new Error("user row not found after signUp");
console.log("user row: ok", { email: found.email, name: found.name ?? null });

// 3. Sign in with the same credentials.
await client.action(anyApi.auth.signIn, {
  provider: "password",
  params: { flow: "signIn", email, password },
});
console.log("signIn: ok");

// 4. Authenticated chat flow.
const token = signUp?.tokens?.token;
if (!token) throw new Error("signIn did not return an access token");
client.setAuth(token);
console.log("setAuth: ok");

const { threadId } = await client.mutation(anyApi.chat.sendMessage, {
  content: "Hello OpenForge! This is the smoke test.",
});
if (!threadId) throw new Error("sendMessage did not return a threadId");
console.log("sendMessage: ok", { threadId });

// Wait for the scheduled ai.reply action to insert the assistant message.
let messages = null;
for (let i = 0; i < 10; i++) {
  await new Promise((r) => setTimeout(r, 1000));
  messages = await client.query(anyApi.threads.listMessages, { threadId });
  if (messages && messages.some((m) => m.role === "assistant")) break;
}
if (!messages) throw new Error("could not read thread messages");
const roles = messages.map((m) => m.role);
if (!roles.includes("user") || !roles.includes("assistant")) {
  throw new Error(`expected user+assistant messages, got: ${roles.join(",")}`);
}
const assistant = messages.find((m) => m.role === "assistant");
console.log("assistant reply: ok", { roles: roles.join(","), preview: assistant.content.slice(0, 60) });

const threads = await client.query(anyApi.threads.list, {});
if (!threads.some((t) => t._id === threadId)) throw new Error("thread not visible in list");
console.log("thread list: ok");

console.log("SMOKE TEST PASSED");
