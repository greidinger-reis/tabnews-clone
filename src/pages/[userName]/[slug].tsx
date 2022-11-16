import { useRouter } from "next/router";
import { trpc } from "~/utils/trpc";
import { Post } from "~/components/Post";
import Spinner from "~/components/Spinner";
import { CommentForm } from "~/components/comments/CommentForm";
import { CommentList } from "~/components/comments/CommentList";
import { atom, useAtom } from "jotai";
import formatComments from "~/components/comments/formatComment";
import { useState } from "react";

interface RouterQuery {
    userName: string;
    slug: string;
}

export const PostIdAtom = atom("");

export default function PostPage() {
    const router = useRouter();
    const [, setPostId] = useAtom(PostIdAtom);
    const [isReplying, setIsReplying] = useState(false);
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

    const { data: comments } = trpc.comments.list.useQuery(
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
                    <div className="mx-2 max-w-4xl rounded-md border border-zinc-300 py-4 px-3 sm:mx-auto sm:px-6">
                        <CommentForm
                            replyingToPost={true}
                            isReplying={isReplying}
                            setIsReplying={setIsReplying}
                            postId={query.data.id}
                        />
                    </div>
                    {comments && (
                        <div className="mx-auto max-w-4xl">
                            <CommentList
                                comments={formatComments(comments || [])}
                            />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
