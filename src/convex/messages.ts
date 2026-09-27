import { internalMutation } from "./_generated/server";
import { v } from "convex/values";

export const insertAssistant = internalMutation({
  args: { threadId: v.id("threads"), content: v.string() },
  handler: async (ctx, { threadId, content }) => {
    const thread = await ctx.db.get(threadId);
    if (!thread) return;
    await ctx.db.insert("messages", {
      threadId,
      userId: thread.userId,
      role: "assistant",
      content,
    });
    await ctx.db.patch(threadId, { updatedAt: Date.now() });
  },
});
