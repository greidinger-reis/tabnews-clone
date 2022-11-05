import { useRouter } from "next/router";
import { trpc } from "~/utils/trpc";

export default function PostIdPage() {
    const router = useRouter();
    const param = router.query.id as string;
    const query = trpc.posts.findById.useQuery(param, { enabled: !!param });

    return (
        <div>
            {query.data?.map((post, index) => (
                <p key={index}>{post.title}</p>
            ))}
            {query.isLoading && <p>loading...</p>}
            {query.data?.length === 0 && <p>no post found</p>}
        </div>
    );
}
