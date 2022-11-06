import { useRouter } from "next/router";

export default function PostPage() {
    const router = useRouter();

    return (
        <div>
            <button onClick={() => console.log(router.query)}>log</button>
        </div>
    );
}
