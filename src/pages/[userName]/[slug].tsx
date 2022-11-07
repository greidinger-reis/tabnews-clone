import { useRouter } from "next/router";
import { trpc } from "~/utils/trpc";
import { Post } from "~/components/Post";
import Spinner from "~/components/Spinner";

interface RouterQuery {
    userName: string;
    slug: string;
}

export default function PostPage() {
    const router = useRouter();
    const { slug, userName } = router.query as unknown as RouterQuery;

    const query = trpc.posts.findById.useQuery({ slug, userName }, {
        enabled: !!slug && !!userName,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
    });

    return (
        <div>
            {query.isLoading && (
                <div className="flex h-screen items-center justify-center">
                    <Spinner />
                </div>
            )}
            {query.isError && <div>Erro ao carregar o post</div>}
            {query.data && <Post post={query.data} />}
        </div>
    );
}
