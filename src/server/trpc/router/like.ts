import { publicProcedure } from "./../trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

export const likeRouter = router({
    addToPost: protectedProcedure
        .input(z.object({ postId: z.string() }))
        .mutation(async ({ input, ctx }) => {
            const { postId } = input;
            const userId = ctx.session.user.id;
            const like = await ctx.prisma.like.findFirst({
                where: {
                    userId,
                    postId,
                },
            });

            if (like) return null;

            return await ctx.prisma.like.create({
                data: {
                    userId,
                    postId,
                },
            });
        }),

    removeFromPost: protectedProcedure
        .input(z.object({ postId: z.string() }))
        .mutation(async ({ input, ctx }) => {
            const { postId } = input;
            const userId = ctx.session.user.id;
            const like = await ctx.prisma.like.findFirst({
                where: {
                    userId,
                    postId,
                },
            });

            if (!like)
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Like not found",
                });

            return await ctx.prisma.like.delete({
                where: {
                    id: like.id,
                },
            });
        }),

    listFromComment: publicProcedure
        .input(
            z.object({
                commentId: z.string(),
            })
        )
        .query(({ input, ctx }) => {
            const { commentId } = input;
            return ctx.prisma.like.findMany({
                where: {
                    commentId,
                },
            });
        }),

    addToComment: protectedProcedure
        .input(z.string())
        .mutation(async ({ ctx, input }) => {
            const authorId = ctx.session?.user?.id;
            return await ctx.prisma.like
                .create({
                    data: {
                        Comment: {
                            connect: {
                                id: input,
                            },
                        },
                        User: {
                            connect: {
                                id: authorId,
                            },
                        },
                    },
                })
                .catch((e) => {
                    console.log(e);
                    throw new TRPCError({
                        code: "BAD_REQUEST",
                        message: `Something went wrong liking the comment (${e.message})`,
                    });
                });
        }),

    removeFromComment: protectedProcedure
        .input(z.string())
        .mutation(async ({ ctx, input }) => {
            const userId = ctx.session?.user?.id;
            return await ctx.prisma.like
                .deleteMany({
                    where: {
                        commentId: input,
                        userId,
                    },
                })
                .catch((e) => {
                    console.log(e);
                    throw new TRPCError({
                        code: "BAD_REQUEST",
                        message: `Something went wrong unliking the comment (${e.message})`,
                    });
                });
        }),
});
