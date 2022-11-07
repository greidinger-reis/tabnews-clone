import { useRouter } from "next/router";
import { trpc } from "~/utils/trpc";
import { Post } from "~/components/Post";
import Spinner from "~/components/Spinner";
import { CommentForm } from "~/components/comments";

interface RouterQuery {
    userName: string;
    slug: string;
}

export default function PostPage() {
    const router = useRouter();
    const { slug, userName } = router.query as unknown as RouterQuery;

    const query = trpc.posts.find.useQuery(
        { slug, userName },
        {
            enabled: !!slug && !!userName,
        }
    );

    return (
        <div>
            {query.isLoading && (
                <div className="flex h-screen items-center justify-center">
                    <Spinner />
                </div>
            )}
            {query.isError && <div>Erro ao carregar o post</div>}
            {query.data && (
                <>
                    <Post post={query.data} />
                    <CommentForm postId={query.data.id} />
                </>
            )}
        </div>
    );
}
