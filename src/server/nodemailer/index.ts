import { User } from "@prisma/client";
import Nodemailer from "nodemailer";
import { env } from "~/env/server.mjs";

const transporter = Nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: env.GMAIL_USER,
        pass: env.GMAIL_PASSWORD,
    },
});

async function sendConfirmationEmail(
    user: User
): Promise<{ ok: boolean; error: Error | null }> {
    const activationURL = `https://tabnews-clone.vercel.app/cadastro/ativar/${user.id}`;
    const mailOpts = {
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
    };

    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOpts, (err, info) => {
            if (err) {
                console.log(err);
                reject({ ok: false, error: err });
            } else {
                console.log(info);
                resolve({ ok: true, error: null });
            }
        });
    });
}
