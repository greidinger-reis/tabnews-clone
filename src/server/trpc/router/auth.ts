import {TRPCError} from "@trpc/server";
import bcrypt from "bcrypt";
import {z} from "zod";
import {publicProcedure, router} from "./../trpc";
import Nodemailer from "nodemailer";
import {env} from "~/env/server.mjs";
import type {User} from "@prisma/client";

const transporter = Nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: env.GMAIL_USER,
        pass: env.GMAIL_PASSWORD,
    },
});

async function sendConfirmationEmail(user: User): Promise<{ ok: boolean; error: Error | null }> {
    let ok = false;
    let error: Error | null = null;

    const activationURL = `https://tabnews-clone.vercel.app/cadastro/ativar/${user.id}`

    console.log({
        status: "Sending confirmation email",
    })

    transporter.sendMail(
        {
            from: env.GMAIL_USER,
            to: user.email,
            subject: "TabNews Clone - Ative sua conta",
            html: `<p>${user.username}, clique no link abaixo para ativar seu cadastro no TabNews(clone)</p>
            <a href=${activationURL}>${activationURL}</a>
            <p>Caso você não tenha feito esta requisição, ignore esse email.</p>
            <br/>
            <p>Atenciosamente,</p>
            <p>João Paulo Greidinger dos Reis</p>
            <a href="https://greidinger.dev">greidinger.dev</a>
            `,
        },
        (err, info) => {
            if (err) {
                console.log(err);
                error = err;
            } else {
                console.log(info);
                ok = true;
            }
        }
    );

    console.log({
        status: "Confirmation email sent",
    })

    return {
        ok,
        error,
    }
}

export const authRouter = router({
    checkCredentials: publicProcedure
        .input(
            z.object({
                email: z.string(),
                password: z.string(),
            })
        )
        .query(async ({ctx, input}) => {
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
        .mutation(async ({ctx, input}) => {
            const user = await ctx.prisma.user.create({
                data: {
                    username: input.username,
                    email: input.email,
                    password: await bcrypt.hash(input.password, 12),
                },
            });

            if (!user) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Não foi possível criar o usuário.",
                });
            }

            const res = await sendConfirmationEmail(user);

            return {...res, email: user.email};
        }),
    confirmEmail: publicProcedure
        .input(z.object({id: z.string()}))
        .mutation(async ({ctx, input}) => {
            const user = await ctx.prisma.user.update({
                where: {
                    id: input.id,
                },
                data: {
                    activated: true,
                },
            });
            if (!user) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message:
                        "Usuário não encontrado para confirmação de email.",
                });
            }
            return {ok: true};
        }),
});
