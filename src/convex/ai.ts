import { action, internalQuery } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";

type ChatMessage = { role: "user" | "assistant"; content: string };

export const loadThread = internalQuery({
  args: { threadId: v.id("threads") },
  handler: async (ctx, { threadId }) => {
    const thread = await ctx.db.get(threadId);
    if (!thread) return null;
    const history = await ctx.db
      .query("messages")
      .withIndex("by_thread", (q) => q.eq("threadId", threadId))
      .order("asc")
      .collect();
    return {
      history: history.map((m): ChatMessage => ({ role: m.role, content: m.content })),
    };
  },
});

export const reply = action({
  args: { threadId: v.id("threads") },
  handler: async (ctx, { threadId }) => {
    const data = await ctx.runQuery(internal.ai.loadThread, { threadId });
    if (!data) return;

    const apiKey = process.env.MISTRAL_API_KEY;
    const model = process.env.MISTRAL_MODEL ?? "mistral-small-latest";
    let content: string;

    if (!apiKey) {
      content =
        "⚡️ The playground is wired up, but no model is connected yet. " +
        "Add a MISTRAL_API_KEY in Settings → Environment and I'll reply with real, " +
        "open-weight model answers (via Mistral AI). Your messages are already persisting in Convex.";
    } else {
      const res = await fetch("https://api.mistral.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: "system",
              content:
                "You are OpenForge, a concise, helpful assistant on an open-source AI platform.",
            },
            ...data.history.slice(-20),
          ],
        }),
      });
      if (!res.ok) {
        content = `⚠️ Model request failed (${res.status}). Check the API key and model name.`;
      } else {
        const resData = (await res.json()) as {
          choices?: { message?: { content?: string } }[];
        };
        content = resData.choices?.[0]?.message?.content ?? "⚠️ Empty response from model.";
      }
    }

    await ctx.runMutation(internal.messages.insertAssistant, { threadId, content });
  },
});
