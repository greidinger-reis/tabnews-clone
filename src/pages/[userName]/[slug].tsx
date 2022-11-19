import { trpc } from "~/utils/trpc";
import { Post } from "~/components/Post";
import { CommentForm } from "~/components/comments/CommentForm";
import { CommentList } from "~/components/comments/CommentList";
import { atom, useAtom } from "jotai";
import { formatComments } from "~/components/comments/formatComment";
import { useState } from "react";
import Head from "next/head";
import type {
    GetServerSideProps,
    GetServerSidePropsContext,
    InferGetServerSidePropsType,
} from "next";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { appRouter } from "~/server/trpc/router/_app";
import { createContextInner } from "~/server/trpc/context";
import superjson from "superjson";
import type { DehydratedState } from "@tanstack/react-query";

interface RouterParams {
    userName: string;
    slug: string;
}

export const PostIdAtom = atom("");

// only load the page when the query is ready
export const getServerSideProps: GetServerSideProps<{
    post: { id: string; slug: string; userName: string };
    trpcState: DehydratedState;
}> = async (ctx: GetServerSidePropsContext) => {
    const ssg = createProxySSGHelpers({
        router: appRouter,
        ctx: await createContextInner({ session: null }),
        transformer: superjson,
    });

    const { userName, slug } = ctx.query as unknown as RouterParams;

    try {
        const post = await ssg.posts.find.fetch({
            slug,
            username: userName,
        });

        const { id } = post;

        await ssg.comments.list.fetch({
            postId: id,
        });

        return {
            props: {
                post: { id, slug, userName },
                trpcState: ssg.dehydrate(),
            },
        };
    } catch {
        return {
            notFound: true,
        };
    }
};

export default function PostPage({
    post,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const { id, slug, userName } = post;

    const [, setPostId] = useAtom(PostIdAtom);

    const [isReplying, setIsReplying] = useState(false);

    const { data } = trpc.posts.find.useQuery(
        { slug, username: userName },
        {
            onSuccess(data) {
                if (!data?.id) return;
                setPostId(data.id);
            },
        }
    );

    const { data: comments } = trpc.comments.list.useQuery({ postId: id });

    return (
        <>
            <Head>
                <title>{data?.title}</title>
            </Head>
            <div>
                {data && (
                    <div className="space-y-4">
                        <Post post={data} />
                        <div className="mx-2 max-w-4xl rounded-md border border-zinc-300 py-4 px-3 sm:mx-auto sm:px-6">
                            <CommentForm
                                replyingToPost={true}
                                isReplying={isReplying}
                                setIsReplying={setIsReplying}
                                postId={id}
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
