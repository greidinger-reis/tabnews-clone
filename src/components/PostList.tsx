import Spinner from "~/components/Spinner";
import Link from "next/link";
import { formatDistance } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useEffect, useRef } from "react";
import { useIsIntersecting } from "~/hooks/useIsIntersecting";
import { trpc } from "~/utils/trpc";

interface PostListProps {
    recents?: boolean;
    userName?: string;
}
export function PostList({ userName, recents }: PostListProps) {
    const postScoreMap = new Map<string, number>();

    const [isLoadMoreVisible, ref] = useIsIntersecting<HTMLDivElement>();

    const query = trpc.posts.list.useInfiniteQuery(
        { limit: 15, recents, userName },
        {
            getNextPageParam: (lastPage) => lastPage.nextCursor,
            refetchOnWindowFocus: false,
            refetchOnMount: false,
            staleTime: Infinity,
        }
    );

    const fetchNextPageRef = useRef(query.fetchNextPage);
    fetchNextPageRef.current = query.fetchNextPage;

    useEffect(() => {
        if (isLoadMoreVisible && query.hasNextPage && !query.isFetching) {
            fetchNextPageRef.current();
        }
    }, [isLoadMoreVisible, query.hasNextPage, query.isFetching]);

    return (
        <div className="container mx-auto flex max-w-[1012px] flex-col px-4 py-4 sm:py-6 sm:px-8">
            {userName ? (
                <h1 className="mb-4 border-b border-zinc-300 pb-4 text-3xl font-bold">
                    {userName}
                </h1>
            ) : null}
            {query.data?.pages.map((page) =>
                page.items.map((post) => {
                    postScoreMap.set(post.id, post._count.Likes);

                    return (
                        <div
                            key={post.id}
                            className="flex w-full pb-2 text-zinc-700"
                        >
                            <span
                                className="font-medium"
                                aria-label="numeracao"
                            >
                                {Array.from(postScoreMap.entries()).findIndex(
                                    ([id]) => id === post.id
                                ) + 1}
                                .
                            </span>
                            <div className="ml-2">
                                <Link
                                    className="font-medium hover:underline"
                                    href={`/${post.author.name}/${post.slug}`}
                                >
                                    {post.title}
                                </Link>
                                <p className="text-[12px] text-zinc-500">
                                    <span>
                                        {postScoreMap.get(post.id)}{" "}
                                        {postScoreMap.get(post.id) === 1
                                            ? "curtiu"
                                            : "curtiram"}{" "}
                                    </span>
                                    ·{" "}
                                    <span>
                                        {post._count.Comment} comentários{" "}
                                    </span>
                                    ·{" "}
                                    <Link
                                        className="hover:underline"
                                        href={`/${post.author.name}`}
                                    >
                                        {post.author.name}
                                    </Link>{" "}
                                    ·{" "}
                                    <span>
                                        {formatDistance(
                                            new Date(post.createdAt),
                                            new Date(),
                                            { locale: ptBR }
                                        )}{" "}
                                        atrás
                                    </span>
                                </p>
                            </div>
                        </div>
                    );
                })
            )}
            <div ref={ref}>
                {query.isFetchingNextPage && (
                    <div className="flex w-full items-center justify-center p-8">
                        <Spinner />
                    </div>
                )}
            </div>
        </div>
    );
}
