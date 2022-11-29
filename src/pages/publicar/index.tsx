import Head from "next/head";
import { useForm } from "react-hook-form";
import type { Post } from "@prisma/client";
import { Editor } from "~/components/Editor";
import { useEditor } from "~/components/Editor/hooks/useEditor";
import { trpc } from "~/utils/trpc";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { PostInput } from "~/components/PostInput";
import Link from "next/link";
import { useState } from "react";

export type PostFormData = Omit<
    Post,
    "createdAt" | "updatedAt" | "authorId" | "slug" | "id"
>;

export default function PublicarPage() {
    const router = useRouter();
    const session = useSession();
    const postForm = useForm<PostFormData>();
    const [error, setError] = useState("");

    const { mutate: createPost } = trpc.posts.create.useMutation({
        onSuccess: (data) => {
            postForm.reset();
            router.push(`/${session.data?.user?.name}/${data.slug}`);
        },
        onError: (error) => {
            setError(error.message);
        },
    });

    function onSubmit(data: PostFormData) {
        setError("");
        console.log(data);
        createPost(data);
    }

    const postEditor = useEditor({ postEditor: { postForm } });

    return (
        <>
            <Head>
                <title>Publicar novo conteúdo</title>
            </Head>
            <main className="container mx-auto mt-4 flex max-w-5xl flex-col gap-4 px-4">
                {error && (
                    <div
                        className="relative mx-auto flex w-full max-w-xl justify-center rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700"
                        role="alert"
                    >
                        <strong className="font-medium">{error}</strong>
                    </div>
                )}
                <h1 className="text-3xl font-medium">Publicar novo conteúdo</h1>
                <div className="flex w-full flex-col gap-4">
                    <PostInput
                        placeholder="Título"
                        {...postForm.register("title", { required: true })}
                    />
                    <Editor editor={{ ...postEditor, isRootComment: true }} />
                    <PostInput
                        placeholder="Fonte (opcional)"
                        {...postForm.register("source", { required: true })}
                    />
                    <div className="flex w-full justify-end gap-2">
                        <Link href="/">
                            <button className="rounded-md py-1 px-4 text-sm hover:bg-gray-100">
                                Cancelar
                            </button>
                        </Link>
                        <button
                            onClick={postForm.handleSubmit(onSubmit)}
                            className="btn-sm-green text-sm font-medium text-white"
                        >
                            Publicar
                        </button>
                    </div>
                </div>
            </main>
        </>
    );
}
