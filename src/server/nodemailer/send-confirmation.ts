import {User} from "@prisma/client";
import Nodemailer from "nodemailer";
import {env} from "~/env/server.mjs";
import {getBaseUrl} from "~/utils/trpc";
import {transporter} from "~/server/nodemailer/index";

export function sendConfirmationEmail(user: User) {
    const activationURL = `${getBaseUrl()}/cadastro/ativar/${user.id}`

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
            } else {
                console.log(info);
            }
        }
    );
}