import Nodemailer from "nodemailer";
import {env} from "~/env/server.mjs";

export const transporter = Nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: env.GMAIL_USER,
        pass: env.GMAIL_PASSWORD,
    },
});