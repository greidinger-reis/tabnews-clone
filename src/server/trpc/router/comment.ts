import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "./../trpc";

export const commentRouter = router({
    list: publicProcedure
        .input(
            z.object({
                postId: z.string(),
            })
        )
        .query(async ({ input, ctx }) => {
            const { postId } = input;
            const comments = await ctx.prisma.comment
                .findMany({
                    where: {
                        post: {
                            id: postId,
                        },
                    },
                    include: {
                        author: { select: { username: true } },
                        likes: { select: { userId: true } },
                    },
                    orderBy: {
                        createdAt: "desc",
                    },
                })
                .catch((err) => {
                    throw new TRPCError({
                        code: "NOT_FOUND",
                        message: err.message,
                    });
                });
            return comments;
        }),

    create: protectedProcedure
        .input(
            z.object({
                postId: z.string(),
                parentId: z.string().optional(),
                content: z.string(),
            })
        )
        .mutation(async ({ input, ctx }) => {
            const { postId, parentId, content } = input;
            const authorId = ctx.session.user.id;

            return await ctx.prisma.comment
                .create({
                    data: {
                        content,
                        post: {
                            connect: {
                                id: postId,
                            },
                        },
                        author: {
                            connect: {
                                id: authorId,
                            },
                        },
                        ...(parentId && {
                            parent: {
                                connect: {
                                    id: parentId,
                                },
                            },
                        }),
                    },
                })
                .catch((err) => {
                    throw new TRPCError({
                        code: "BAD_REQUEST",
                        message: `Something went wrong creating the comment (${err.message})`,
                    });
                });
        }),

    delete: protectedProcedure
        .input(
            z.object({
                commentId: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const { commentId } = input;
            return await ctx.prisma.comment
                .delete({
                    where: {
                        id: commentId,
                    },
                })
                .catch((err) => {
                    throw new TRPCError({
                        code: "BAD_REQUEST",
                        message: `Something went wrong deleting the comment (${err.message})`,
                    });
                });
        }),

    update: protectedProcedure
        .input(
            z.object({
                id: z.string(),
                content: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const { id, content } = input;
            return await ctx.prisma.comment.update({
                where: {
                    id,
                },
                data: {
                    content,
                    hasBeenEdited: true,
                },
            });
        }),
});
