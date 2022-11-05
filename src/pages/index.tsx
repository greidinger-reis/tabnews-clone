import Link from "next/link";
import { useEffect, useRef } from "react";
import Spinner from "~/components/Spinner";
import { useIsIntersecting } from "~/hooks/useIsIntersecting";
import { trpc } from "~/utils/trpc";
import { formatDistance } from "date-fns";
import { ptBR } from "date-fns/locale";

// import { GetStaticProps } from 'next'
//TODO: GET INITIAL DATA
// export const getStaticProps: GetStaticProps = async () => {
//     const { data } = await

//     return {
//         props: {

//         }
//     }
// }

export default function HomePage() {
    const postScoreMap = new Map<string, number>();

    const [isLoadMoreVisible, ref] = useIsIntersecting<HTMLDivElement>();

    const query = trpc.posts.getAll.useInfiniteQuery(
        { limit: 15 },
        {
            getNextPageParam: (lastPage) => lastPage.nextCursor,
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
        <div>
            {/* <button onClick={() => console.log(postScoreMap)}>log</button> */}
            <div className="flex flex-col gap-2 p-4">
                {query.isLoading ? (
                    <div className="flex w-full items-center justify-center p-8">
                        <Spinner />
                    </div>
                ) : (
                    query.data?.pages.map((page) =>
                        page.items.map((post) => {
                            postScoreMap.set(post.id, post.score);

                            return (
                                <div
                                    key={post.id}
                                    className="rounded border bg-white py-4 px-6 text-zinc-700 drop-shadow"
                                >
                                    <div className="font-medium">
                                        <span>
                                            {Array.from(
                                                postScoreMap.entries()
                                            ).findIndex(
                                                ([id]) => id === post.id
                                            ) + 1}
                                            .
                                        </span>{" "}
                                        <Link
                                            className="hover:underline"
                                            href={`/${post.authorId}/${post.id}`}
                                        >
                                            {post.title} {post.id}
                                        </Link>
                                    </div>
                                    <div>
                                        <p className="text-[12px]">
                                            <span>
                                                {postScoreMap.get(post.id)}{" "}
                                                {postScoreMap.get(post.id) === 1
                                                    ? "curtiu"
                                                    : "curtiram"}{" "}
                                            </span>
                                            ·{" "}
                                            <span>
                                                {post._count.Comment}{" "}
                                                comentários{" "}
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
                    )
                )}
                <div ref={ref}>
                    {query.isFetchingNextPage && (
                        <div className="flex w-full items-center justify-center p-8">
                            <Spinner />
                        </div>
                    )}
                    {!query.hasNextPage && !query.isFetching && (
                        <p className="py-4 text-center">
                            Você carregou todos os posts. Parabéns
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
