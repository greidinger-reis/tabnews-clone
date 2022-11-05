import { useEffect, useRef } from "react";
import { useIsIntersecting } from "~/hooks/useIsIntersecting";
import { trpc } from "~/utils/trpc";
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
    const [isLoadMoreVisible, ref] = useIsIntersecting<HTMLDivElement>();

    const query = trpc.posts.getAll.useInfiniteQuery(
        { limit: 30 },
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
            <h1>Posts</h1>
            <div>
                {query.isLoading ? (
                    <p>Loading...</p>
                ) : (
                    query.data?.pages.map((page) =>
                        page.items.map((post, index) => (
                            <div key={post.id} className="flex gap-2">
                                <span>{index}</span>
                                <span>{post.title}</span>
                            </div>
                        ))
                    )
                )}
                <div ref={ref}>
                    {query.isFetchingNextPage ? (
                        <p>Loading next page...</p>
                    ) : (
                        <button
                            disabled={!query.hasNextPage}
                            onClick={() => query.fetchNextPage()}
                            className={
                                "w-full cursor-pointer p-4" +
                                (!query.hasNextPage ? " opacity-50" : "")
                            }
                        >
                            {query.hasNextPage
                                ? "Load more"
                                : "You loaded everything"}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
