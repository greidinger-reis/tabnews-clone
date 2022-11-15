import type { Outputs } from "~/types/trpc";
import { formatDistance } from "date-fns";
import { ptBR } from "date-fns/locale";
import Markdown from "markdown-to-jsx";
import { BsLink45Deg } from "react-icons/bs";
import { trpc } from "~/utils/trpc";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Likes } from "./Likes";

type PostQueryOutput = Outputs["posts"]["find"];

export function Post({ post }: { post: PostQueryOutput }) {
    const session = useSession();
    const router = useRouter();
    const trpcContext = trpc.useContext();
    const addLike = trpc.likes.addToPost.useMutation();
    const removeLike = trpc.likes.removeFromPost.useMutation();

    const userHasLiked = post.Likes.some(
        (like) => like.userId === session.data?.user?.id
    );

    async function handleAddLike() {
        if (!session.data) {
            router.push("/login");
            return;
        }
        if (userHasLiked) return;

        const result = await addLike.mutateAsync({ postId: post.id });

        if (!result) return;

        post.author.username &&
            trpcContext.posts.find.invalidate({
                slug: post.slug,
                username: post.author.username,
            });
    }

    async function handleRemoveLike() {
        if (!session.data) {
            router.push("/login");
            return;
        }
        if (!userHasLiked) return;

        const result = await removeLike.mutateAsync({ postId: post.id });

        if (!result) return;

        post.author.username &&
            trpcContext.posts.find.invalidate({
                slug: post.slug,
                username: post.author.username,
            });
    }

    return (
        <div className="prose mx-auto mt-4 flex max-w-[58rem]">
            <Likes
                handleAddLike={handleAddLike}
                handleRemoveLike={handleRemoveLike}
                likesCount={post._count.Likes}
                userHasLiked={userHasLiked}
            />
            <main>
                <div>
                    <span className="rounded-md bg-[#ddf4ff] px-2 py-1 font-mono text-xs text-blue-500">
                        {post.author.username}
                    </span>
                    <span className="ml-2 text-[12px]">
                        {formatDistance(new Date(post.createdAt), new Date(), {
                            locale: ptBR,
                        })}{" "}
                        atrás
                    </span>
                    <h1 className="mb-2 text-4xl font-semibold">
                        {post.title}
                    </h1>
                </div>
                <article>
                    <Markdown>{post.content}</Markdown>
                    <p className="font-medium">
                        <BsLink45Deg className="inline text-xl text-black" />
                        Fonte:{" "}
                        <a
                            className="normal-case text-blue-500 no-underline hover:underline"
                            href={post.source ?? undefined}
                        >
                            {post.source}
                        </a>
                    </p>
                </article>
            </main>
        </div>
    );
}
