import type {
    GetServerSideProps,
    GetServerSidePropsContext,
    InferGetServerSidePropsType
} from "next";
import {PrismaClient} from "@prisma/client";
import z from "zod";
import {useRouter} from "next/router";
import {useEffect} from "react";
import classNames from "classnames";

export const getServerSideProps: GetServerSideProps<{ confirmed: boolean }> = async (context: GetServerSidePropsContext) => {

    let id: string;

    try {
        id = z.string().cuid().parse(context.params?.id);
    } catch (e) {
        return {
            props: {
                confirmed: false
            }
        }
    }

    if (!id) return {
        props: {
            confirmed: false,
        }
    };

    const prisma = new PrismaClient();

    try {
        await prisma?.user.update({
            where: {
                id
            },
            data: {
                activated: true
            }
        })
        console.log("User confirmed");
        return {
            props: {
                confirmed: true
            }
        }

    } catch (e) {
        return {
            props: {
                confirmed: false
            }
        }
    }
}

export default function CadastroConfirmPage({confirmed}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const router = useRouter();

    useEffect(() => {
        setTimeout(() => {
            router.push("/");
        }, 3000);

    }, [router]);

    return (
        <div
            className={classNames("w-fit mt-20 mx-auto py-4 px-8 rounded-md border", {
                "bg-red-200/80 border-red-300": !confirmed,
                "bg-green-200/80 border-green-300": confirmed
            })}>
            {confirmed ? "Sua conta foi ativada com sucesso!" : "Não foi possível ativar sua conta."}
        </div>
    )
}