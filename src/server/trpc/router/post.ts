import { z } from "zod";
import { router, publicProcedure } from "./../trpc";

export const postRouter = router({
    list: publicProcedure
        .input(
            z.object({
                limit: z.number().min(1).max(100).optional(),
                cursor: z.string().optional(), // <-- "cursor" needs to exist, but can be any type
                recents: z.boolean().optional(),
                userName: z.string().optional(),
            })
        )
        .query(async ({ input, ctx }) => {
            const { cursor, recents, userName } = input;
            const limit = input.limit ?? 30;
            const items = await ctx.prisma.post.findMany({
                take: limit + 1, // get an extra item at the end which we'll use as next cursor
                where: userName
                    ? {
                          // if userName is provided, filter by it
                          author: {
                              name: userName,
                          },
                      }
                    : {},
                cursor: cursor ? { id: cursor } : undefined,
                orderBy: recents // if recents is true, order by createdAt, otherwise order by score
                    ? {
                          createdAt: "desc",
                      }
                    : {
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
    findById: publicProcedure
        .input(z.object({ slug: z.string(), userName: z.string() }))
        .query(async ({ input, ctx }) => {
            const { slug, userName } = input;
            return await ctx.prisma.post.findFirstOrThrow({
                where: { author: { name: userName }, slug },
                include: {
                    author: {
                        select: {
                            name: true,
                        },
                    },
                },
            });
        }),
});
