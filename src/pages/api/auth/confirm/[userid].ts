import {NextApiRequest, NextApiResponse} from "next";
import z from "zod";

export default async function handleEmailConfirmation(req: NextApiRequest, res: NextApiResponse) {
    const {userid} = req.query;
    const id = z.string().parse(userid);

    if (!id) return res.status(400).json({message: "Invalid user id"});

    try {
        await prisma?.user.update({
            where: {
                id
            },
            data: {
                activated: true
            }
        })
        return res.status(200).json({message: "Usuário confirmado com sucesso"});

    } catch (e) {
        return res.status(404).json({message: "Usuário para confirmar não encontrado"});
    }
}