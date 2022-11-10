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
                              username: userName,
                          },
                      }
                    : undefined,
                cursor: cursor ? { id: cursor } : undefined,
                orderBy: recents // if recents is true, order by createdAt
                    ? {
                          createdAt: "desc",
                      }
                    : undefined,
                include: {
                    author: { select: { username: true } },
                    _count: {
                        select: {
                            Comment: true,
                            Likes: true,
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
    find: publicProcedure
        .input(z.object({ slug: z.string(), username: z.string() }))
        .query(async ({ input, ctx }) => {
            const { slug, username } = input;
            return await ctx.prisma.post.findFirstOrThrow({
                where: { author: { username }, slug },
                include: {
                    author: {
                        select: {
                            username: true,
                        },
                    },
                    Likes: {
                        select: {
                            userId: true,
                        },
                    },
                    _count: {
                        select: {
                            Comment: true,
                            Likes: true,
                        },
                    },
                },
            });
        }),
});
