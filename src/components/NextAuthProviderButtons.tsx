import { signIn } from "next-auth/react";
import { AiFillGithub } from "react-icons/ai";
import { FaDiscord } from "react-icons/fa";

export function NextAuthProviderButtons() {
    return (
        <div className="mt-4 flex w-full items-center justify-center gap-4">
            <button
                type="button"
                onClick={() => signIn("github")}
                className="rounded-md border border-zinc-300 bg-gray-100 p-8 py-2 transition-all hover:bg-gray-200"
            >
                <AiFillGithub className="text-2xl text-zinc-600" />
            </button>
            <button
                type="button"
                onClick={() => signIn("discord")}
                className="rounded-md border border-zinc-300 bg-gray-100 p-8 py-2 transition-all hover:bg-gray-200"
            >
                <FaDiscord className="text-2xl text-zinc-600" />
            </button>
        </div>
    );
}
