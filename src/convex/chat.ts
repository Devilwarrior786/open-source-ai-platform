import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { requireUserId } from "./users";
import { api } from "./_generated/api";

export const sendMessage = mutation({
  args: { threadId: v.optional(v.id("threads")), content: v.string() },
  handler: async (ctx, { threadId, content }) => {
    const userId = await requireUserId(ctx);
    const trimmed = content.trim();
    if (!trimmed) throw new Error("Message cannot be empty");

    let id = threadId;
    if (!id) {
      id = await ctx.db.insert("threads", {
        userId,
        title: trimmed.slice(0, 48) + (trimmed.length > 48 ? "…" : ""),
        updatedAt: Date.now(),
      });
    } else {
      const thread = await ctx.db.get(id);
      if (!thread || thread.userId !== userId) throw new Error("Thread not found");
      await ctx.db.patch(id, { updatedAt: Date.now() });
    }

    await ctx.db.insert("messages", { threadId: id, userId, role: "user", content: trimmed });
    await ctx.scheduler.runAfter(0, api.ai.reply, { threadId: id });
    return { threadId: id };
  },
});
