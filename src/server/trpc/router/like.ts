import {TRPCError} from "@trpc/server";
import {z} from "zod";
import {protectedProcedure, router} from "../trpc";

export const likeRouter = router({
    add: protectedProcedure
        .input(z.object({postId: z.string()}))
        .mutation(async ({input, ctx}) => {
            const {postId} = input;
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

    remove: protectedProcedure
        .input(z.object({postId: z.string()}))
        .mutation(async ({input, ctx}) => {
            const {postId} = input;
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
});
