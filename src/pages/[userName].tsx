import { PostList } from "~/components/PostList";
import { useRouter } from "next/router";

export default function UserPostListPage() {
    const router = useRouter();
    const { userName } = router.query;

    return <PostList userName={userName as string} />;
}
