import { PostList } from "~/components/PostList";
import { useRouter } from "next/router";

export default function UserPostListPage() {
    const router = useRouter();
    const { username } = router.query;

    return <PostList userName={username as string} />;
}
