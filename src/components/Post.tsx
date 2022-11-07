import type { Outputs } from "~/types/trpc";
import { formatDistance } from "date-fns";
import { ptBR } from "date-fns/locale";
import Markdown from "markdown-to-jsx";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";
import { trpc } from "~/utils/trpc";
import { useSession } from "next-auth/react";
import classNames from "classnames";

type PostQueryOutput = Outputs["posts"]["find"];

const queries = "lg:3/4 w-full sm:w-4/5 2xl:w-1/2";

export function Post({ post }: { post: PostQueryOutput }) {
    const session = useSession();
    const trpcContext = trpc.useContext();
    const addLike = trpc.likes.add.useMutation();
    const removeLike = trpc.likes.remove.useMutation();

    const userHasLiked = post.Likes.some(
        (like) => like.userId === session.data?.user?.id
    );

    async function handleAddLike() {
        if (userHasLiked) return;

        const result = await addLike.mutateAsync({ postId: post.id });

        if (!result) return;

        post.author.name &&
            trpcContext.posts.find.invalidate({
                slug: post.slug,
                userName: post.author.name,
            });
    }

    async function handleRemoveLike() {
        if (!userHasLiked) return;

        const result = await removeLike.mutateAsync({ postId: post.id });

        if (!result) return;

        post.author.name &&
            trpcContext.posts.find.invalidate({
                slug: post.slug,
                userName: post.author.name,
            });
    }

    return (
        <div className="flex flex-col items-center">
            <div className={"mt-8 flex " + queries}>
                <aside className="h-full px-4 pt-4">
                    <div className="flex flex-col items-center gap-1">
                        <button
                            className={classNames(
                                "rounded-lg p-2 hover:bg-[#ddf4ff]/50",
                                {
                                    "bg-[#ddf4ff]/50 text-blue-500":
                                        userHasLiked,
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
                </aside>

                <div>
                    <span className="rounded-md bg-[#ddf4ff] px-2 py-1 font-mono text-[12px] text-blue-500">
                        {post.author.name}
                    </span>
                    <span className="ml-2 text-[12px]">
                        {formatDistance(new Date(post.createdAt), new Date(), {
                            locale: ptBR,
                        })}{" "}
                        atrás
                    </span>
                    <p className="mt-2 text-4xl font-semibold">{post.title}</p>
                </div>
            </div>
            <main
                className={
                    "prose ml-[60px] max-w-none border-l border-dotted border-zinc-300 pl-6 " +
                    queries
                }
            >
                <Markdown>{post.content}</Markdown>
            </main>
        </div>
    );
}
