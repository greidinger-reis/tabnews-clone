import {User} from "@prisma/client";
import Nodemailer from "nodemailer";
import {env} from "~/env/server.mjs";
import {getBaseUrl} from "~/utils/trpc";
import {transporter} from "~/server/nodemailer/index";

export function sendConfirmationEmail(user: User) {
    transporter.sendMail(
        {
            from: env.GMAIL_USER,
            to: user.email,
            subject: "TabNews Clone - Ative sua conta",
            html: `<h1>Olá, ${user.username}</h1>
            <p>Para ativar sua conta, clique no botão abaixo:</p>
            <a href="${getBaseUrl()}/auth/confirm/${user.id}">Ativar conta</a>
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