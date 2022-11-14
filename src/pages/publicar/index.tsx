import Head from "next/head";
import { useForm } from "react-hook-form";
import type { Post } from "@prisma/client";

type PostFormData = Omit<
    Post,
    "createdAt" | "updatedAt" | "authorId" | "slug" | "id"
>;

export default function PublicarPage() {
    const { handleSubmit, register } = useForm<PostFormData>();

    function onSubmit(data: PostFormData) {
        console.log(data);
    }

    return (
        <>
            <Head>
                <title>Publicar novo conteúdo</title>
            </Head>
            <main className="container mx-auto max-w-5xl py-20 px-4 outline">
                <h1 className="text-3xl font-medium">Publicar novo conteúdo</h1>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <input
                        type="text"
                        {...register("title", { required: true })}
                    />
                    <input
                        type="text"
                        {...register("content", { required: true })}
                    />
                    <input type="text" {...register("source")} />
                </form>
            </main>
        </>
    );
}
