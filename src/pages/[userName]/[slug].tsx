import { useRouter } from "next/router";
import { trpc } from "~/utils/trpc";
import { Post } from "~/components/Post";
import Spinner from "~/components/Spinner";
import { CommentForm } from "~/components/comments/CommentForm";
import { CommentList } from "~/components/comments/CommentList";
import { atom, useAtom } from "jotai";
import { formatComments } from "~/components/comments/formatComment";

interface RouterQuery {
    userName: string;
    slug: string;
}

export const PostIdAtom = atom("");

export default function PostPage() {
    const [, setPostId] = useAtom(PostIdAtom);
    const router = useRouter();
    const { slug, userName } = router.query as unknown as RouterQuery;

    const query = trpc.posts.find.useQuery(
        { slug, username: userName },
        {
            enabled: !!slug && !!userName,

            onSuccess(data) {
                setPostId(data.id);
            },
        }
    );

    const { data: rawComments } = trpc.comments.list.useQuery(
        {
            postId: query.data?.id ?? "",
        },
        {
            enabled: !!query.data?.id,
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
                <div className="space-y-4">
                    <Post post={query.data} />
                    <CommentForm postId={query.data.id} />
                    {rawComments ? (
                        <div className="mx-auto max-w-4xl">
                            <CommentList
                                comments={formatComments(rawComments)}
                            />
                        </div>
                    ) : null}
                </div>
            )}
        </div>
    );
}
