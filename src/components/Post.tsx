import type { Outputs } from "~/types/trpc";
import { formatDistance } from "date-fns";
import { ptBR } from "date-fns/locale";
import Markdown from "markdown-to-jsx";
import { BsChevronDown, BsChevronUp, BsLink45Deg } from "react-icons/bs";
import { trpc } from "~/utils/trpc";
import { useSession } from "next-auth/react";
import classNames from "classnames";
import { useRouter } from "next/router";

type PostQueryOutput = Outputs["posts"]["find"];

export function Post({ post }: { post: PostQueryOutput }) {
    const session = useSession();
    const router = useRouter();
    const trpcContext = trpc.useContext();
    const addLike = trpc.likes.add.useMutation();
    const removeLike = trpc.likes.remove.useMutation();

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
        <div className="prose mx-auto mt-4 flex sm:w-3/4 sm:max-w-none lg:w-1/2">
            <aside className="flex flex-col items-center px-1 pt-4 sm:px-4">
                <div className="flex flex-col items-center gap-1">
                    <button
                        className={classNames(
                            "rounded-lg p-2 hover:bg-[#ddf4ff]/50",
                            {
                                "bg-[#ddf4ff]/50 text-blue-500": userHasLiked,
                            }
                        )}
                        onClick={handleAddLike}
                    >
                        <BsChevronUp className="text-sm" />
                    </button>
                    <span className="text-[12px] font-medium text-blue-500">
                        {post._count.Likes}
                    </span>
                    <button
                        className="rounded-lg p-2 hover:bg-[#ddf4ff]/50"
                        onClick={handleRemoveLike}
                    >
                        <BsChevronDown className="text-sm" />
                    </button>
                </div>
                <div className="h-full border-l border-dotted"></div>
            </aside>
            <main>
                <div>
                    <span className="rounded-md bg-[#ddf4ff] px-2 py-1 font-mono text-[12px] text-blue-500">
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
                    <p className="text-lg font-medium">
                        <BsLink45Deg />
                        Fonte:
                        {post.source}
                    </p>
                </article>
            </main>
        </div>
    );
}
