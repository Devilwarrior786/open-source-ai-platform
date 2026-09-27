import { query } from "./_generated/server";
import { v } from "convex/values";
import { requireUserId } from "./users";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await requireUserId(ctx);
    return await ctx.db
      .query("threads")
      .withIndex("by_user_and_updated", (q) => q.eq("userId", userId))
      .order("desc")
      .take(30);
  },
});

export const get = query({
  args: { threadId: v.id("threads") },
  handler: async (ctx, { threadId }) => {
    const userId = await requireUserId(ctx);
    const thread = await ctx.db.get(threadId);
    if (!thread || thread.userId !== userId) return null;
    return thread;
  },
});

export const listMessages = query({
  args: { threadId: v.id("threads") },
  handler: async (ctx, { threadId }) => {
    const userId = await requireUserId(ctx);
    const thread = await ctx.db.get(threadId);
    if (!thread || thread.userId !== userId) return null;
    return await ctx.db
      .query("messages")
      .withIndex("by_thread", (q) => q.eq("threadId", threadId))
      .order("asc")
      .collect();
  },
});
