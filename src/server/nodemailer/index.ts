import Nodemailer from "nodemailer";
import {env} from "~/env/server.mjs";
import type {User} from "@prisma/client";
import {getBaseUrl} from "~/utils/trpc";
import type {SentMessageInfo} from "nodemailer/lib/smtp-transport";

const transporter = Nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: env.GMAIL_USER,
        pass: env.GMAIL_PASSWORD,
    },
});

export async function sendConfirmationEmail(user: User): Promise<{ ok: boolean; error: Error | null }> {
    let ok = false;
    let error: Error | null = null;

    const activationURL = `${getBaseUrl()}/cadastro/ativar/${user.id}`

    console.log({
        status: "Sending confirmation email",
        activationURL,
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

    return {
        ok,
        error,
    }
}