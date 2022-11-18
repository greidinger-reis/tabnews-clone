import { trpc } from "~/utils/trpc";
import { Post } from "~/components/Post";
import { CommentForm } from "~/components/comments/CommentForm";
import { CommentList } from "~/components/comments/CommentList";
import { atom, useAtom } from "jotai";
import { formatComments } from "~/components/comments/formatComment";
import { useState } from "react";
import type {
    GetStaticPaths,
    GetStaticProps,
    GetStaticPropsContext,
    InferGetStaticPropsType,
} from "next";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import superjson from "superjson";
import { appRouter } from "~/server/trpc/router/_app";
import { createContextInner } from "~/server/trpc/context";
import type { DehydratedState } from "@tanstack/react-query";
import Head from "next/head";

export const PostIdAtom = atom("");

export const getStaticPaths: GetStaticPaths = async () => {
    const ssg = createProxySSGHelpers({
        router: appRouter,
        ctx: await createContextInner({ session: null }),
        transformer: superjson,
    });

    const paths = await ssg.posts.listPaths.fetch();

    return {
        paths: paths.map((path) => ({
            params: {
                userName: path.author.username,
                slug: path.slug,
            },
        })),
        fallback: "blocking",
    };
};

export const getStaticProps: GetStaticProps<{
    params: { slug: string; username: string };
    postId: string;
    trpcState: DehydratedState;
}> = async (ctx: GetStaticPropsContext) => {
    const params = {
        slug: ctx.params?.slug as string,
        username: ctx.params?.userName as string,
    };

    const ssg = createProxySSGHelpers({
        router: appRouter,
        ctx: await createContextInner({ session: null }),
        transformer: superjson,
    });

    try {
        const post = await ssg.posts.find.fetch(params);
        const postId = post.id;

        await ssg.comments.list.prefetch({ postId });

        return {
            props: {
                params,
                postId,
                trpcState: ssg.dehydrate(),
            },
        };
    } catch (error) {
        return {
            notFound: true,
        };
    }
};

export default function PostPage({
    params,
    postId,
}: InferGetStaticPropsType<typeof getStaticProps>) {
    const [, setPostId] = useAtom(PostIdAtom);
    const [isReplying, setIsReplying] = useState(false);
    const query = trpc.posts.find.useQuery(params, {
        onSuccess(data) {
            if (!data?.id) return;
            setPostId(data.id);
        },
    });

    const { data: comments } = trpc.comments.list.useQuery({ postId });

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
