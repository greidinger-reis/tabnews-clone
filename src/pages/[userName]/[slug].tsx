import {useRouter} from "next/router";
import {trpc} from "~/utils/trpc";
import {Post} from "~/components/Post";
import Spinner from "~/components/Spinner";
import {CommentForm} from "~/components/comments";

interface RouterQuery {
    username: string;
    slug: string;
}

export default function PostPage() {
    const router = useRouter();
    const {slug, username} = router.query as unknown as RouterQuery;

    const query = trpc.posts.find.useQuery(
        {slug, username},
        {
            enabled: !!slug && !!username,
        }
    );

    console.log({
        slug,
        username,
        data: query.data
    });

    return (
        <div>
            {query.isLoading && (
                <div className="flex h-screen items-center justify-center">
                    <Spinner/>
                </div>
            )}
            {query.isError && <div>Erro ao carregar o post</div>}
            {query.data && (
                <>
                    <Post post={query.data}/>
                    <CommentForm postId={query.data.id}/>
                </>
            )}
        </div>
    );
}
