import type {GetStaticProps} from "next";
import {createProxySSGHelpers} from "@trpc/react-query/ssg";
import {appRouter} from "~/server/trpc/router/_app";
import {createContextInner} from "~/server/trpc/context";
import superjson from "superjson";
import {PostList} from "~/components/PostList";
import {trpc} from "~/utils/trpc";

export const getStaticProps: GetStaticProps = async () => {
    const ssg = createProxySSGHelpers({
        router: appRouter,
        ctx: await createContextInner({session: null}),
        transformer: superjson,
    });

    await ssg.posts.list.prefetchInfinite({limit: 15});

    return {
        props: {trpcState: ssg.dehydrate()},
        revalidate: 10,
    };
};

export default function HomePage() {
    return <PostList/>;
}
