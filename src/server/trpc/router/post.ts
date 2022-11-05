import { z } from "zod";
import { router, publicProcedure } from "./../trpc";

export const postRouter = router({
    findById: publicProcedure
        .input(z.string())
        .query(async ({ ctx, input }) => {
            return await ctx.prisma.post.findMany({
                where: {
                    id: input,
                },
            });
        }),

    getAll: publicProcedure
        .input(
            z.object({
                limit: z.number().min(1).max(100).optional(),
                cursor: z.string().optional(), // <-- "cursor" needs to exist, but can be any type
            })
        )
        .query(async ({ input, ctx }) => {
            const { cursor } = input;
            const limit = input.limit ?? 30;
            const items = await ctx.prisma.post.findMany({
                take: limit + 1, // get an extra item at the end which we'll use as next cursor
                where: {},
                cursor: cursor ? { id: cursor } : undefined,
                orderBy: {
                    score: "desc",
                },
                include: {
                    author: { select: { name: true } },
                    _count: {
                        select: {
                            Comment: true,
                        },
                    },
                },
            });

            let nextCursor: typeof cursor | undefined = undefined;

            if (items.length > limit) {
                const nextItem = items.pop();
                nextCursor = nextItem?.id;
            }

            return {
                items,
                nextCursor,
            };
        }),
});
