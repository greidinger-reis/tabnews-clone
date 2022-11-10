import { TRPCError } from "@trpc/server";
import bcrypt from "bcrypt";
import { z } from "zod";
import { router, publicProcedure } from "./../trpc";

export const authRouter = router({
    checkCredentials: publicProcedure
        .input(
            z.object({
                email: z.string(),
                password: z.string(),
            })
        )
        .query(async ({ ctx, input }) => {
            const user = await ctx.prisma.user.findUnique({
                where: {
                    email: input.email,
                },
            });

            if (!user?.password) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message:
                        "Dados não conferem. Verifique se os dados enviados estão corretos.",
                });
            }

            const isPasswordValid = await bcrypt.compare(
                input.password,
                user.password
            );

            if (!isPasswordValid) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message:
                        "Dados não conferem. Verifique se os dados enviados estão corretos.",
                });
            }

            return {
                id: user.id,
                email: user.email,
                username: user.username,
            };
        }),

    register: publicProcedure
        .input(
            z.object({
                email: z.string(),
                username: z.string(),
                password: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            try {
                const user = await ctx.prisma.user.create({
                    data: {
                        username: input.username,
                        email: input.email,
                        password: await bcrypt.hash(input.password, 12),
                    },
                });
                return user;
            } catch (error) {
                return error;
            }
        }),
});
