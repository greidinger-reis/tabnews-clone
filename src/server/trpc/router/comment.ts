import {TRPCError} from "@trpc/server";
import {z} from "zod";
import {protectedProcedure, publicProcedure, router} from "./../trpc";

export const commentRouter = router({
    list: publicProcedure
        .input(
            z.object({
                postId: z.string(),
            })
        )
        .query(({input, ctx}) => {
            const {postId} = input;
            return ctx.prisma.comment
                .findMany({
                    where: {
                        post: {
                            id: postId,
                        },
                    },
                    include: {
                        author: {select: {username: true}},
                        _count: {select: {likes: true}},
                    },
                })
                .catch((err) => {
                    throw new TRPCError({
                        code: "NOT_FOUND",
                        message: err.message,
                    });
                });
        }),

    create: protectedProcedure
        .input(
            z.object({
                postId: z.string(),
                parentId: z.string().optional(),
                content: z.string(),
            })
        )
        .mutation(async ({input, ctx}) => {
            const {postId, parentId, content} = input;
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
        .mutation(async ({ctx, input}) => {
            const {commentId} = input;
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
});
