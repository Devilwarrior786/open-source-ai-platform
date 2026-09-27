import { QueryCtx, MutationCtx, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";
import { getAuthUserId } from "@convex-dev/auth/server";

export async function getAuthUser(ctx: QueryCtx | MutationCtx): Promise<Doc<"users"> | null> {
  const userId = await getAuthUserId(ctx);
  if (!userId) return null;
  return await ctx.db.get(userId as Id<"users">);
}

export async function requireUserId(ctx: QueryCtx | MutationCtx): Promise<Id<"users">> {
  const userId = await getAuthUserId(ctx);
  if (!userId) throw new Error("Not authenticated");
  return userId as Id<"users">;
}

export const me = query({
  args: {},
  handler: async (ctx) => {
    const user = await getAuthUser(ctx);
    if (!user) return null;
    return { _id: user._id, email: user.email, name: user.name };
  },
});

export const debugListUsers = query({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("users").take(50);
    return users.map((u) => ({ _id: u._id, email: u.email, name: u.name }));
  },
});
