import { trpc } from "~/utils/trpc";
import { Post } from "~/components/Post";
import { CommentForm } from "~/components/comments/CommentForm";
import { CommentList } from "~/components/comments/CommentList";
import { atom, useAtom } from "jotai";
import { formatComments } from "~/components/comments/formatComment";
import { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

export const PostIdAtom = atom("");

interface RouterParams {
    userName: string;
    slug: string;
}

export default function PostPage() {
    const router = useRouter();
    const { slug, userName } = router.query as unknown as RouterParams;
    const [postId, setPostId] = useAtom(PostIdAtom);
    const [isReplying, setIsReplying] = useState(false);
    const query = trpc.posts.find.useQuery(
        { slug, username: userName },
        {
            onSuccess(data) {
                if (!data?.id) return;
                setPostId(data.id);
            },
            enabled: !!slug && !!userName,
        }
    );

    const { data: comments } = trpc.comments.list.useQuery(
        { postId },
        {
            enabled: !!postId,
        }
    );

    return (
        <>
            <Head>
                <title>{query.data?.title}</title>
            </Head>
            <div>
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
        </>
    );
}
