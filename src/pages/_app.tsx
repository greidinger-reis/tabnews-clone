import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider, signOut, useSession } from "next-auth/react";
import { trpc } from "../utils/trpc";
import "../styles/globals.css";
import Link from "next/link";
import { useRouter } from "next/router";
import classNames from "classnames";
import Dropdown from "../components/headlessui/Dropdown";
import { FiChevronDown } from "react-icons/fi";
import { IoNewspaperOutline } from "react-icons/io5";

export const HEADER_HEIGHT = "64px";

const MyApp: AppType<{ session: Session | null }> = ({
    Component,
    pageProps: { session, ...pageProps },
}) => {
    return (
        <SessionProvider session={session}>
            <Navbar />
            <Component {...pageProps} />
        </SessionProvider>
    );
};

function Navbar() {
    const router = useRouter();
    const { data: session } = useSession();

    return (
        <header
            style={{ height: HEADER_HEIGHT }}
            className="flex items-center justify-between bg-zinc-800 px-4 text-white"
        >
            <ul className="flex items-center gap-4 text-sm font-medium">
                <li>
                    <Link
                        className="flex items-center gap-1 transition-all hover:text-zinc-400"
                        href="/"
                    >
                        <IoNewspaperOutline className="text-2xl" />
                        TabNews Clone
                    </Link>
                </li>
                <li>
                    <Link
                        className={classNames(
                            "transition-all hover:border-zinc-400 hover:text-zinc-400",
                            {
                                "border-b border-white pb-1":
                                    router.asPath === "/",
                            }
                        )}
                        href="/"
                    >
                        Relevantes
                    </Link>
                </li>
                <li>
                    <Link
                        className={classNames(
                            "transition-all hover:border-zinc-400 hover:text-zinc-400",
                            {
                                "border-b border-white pb-1":
                                    router.asPath === "/recentes",
                            }
                        )}
                        href="/recentes"
                    >
                        Recentes
                    </Link>
                </li>
            </ul>
            <div>
                {session ? (
                    <div>
                        <span>Olá, {session.user?.name}</span>
                        <Dropdown
                            button={
                                <button>
                                    <FiChevronDown />
                                </button>
                            }
                        >
                            <ul>
                                <li>
                                    <Link href="/perfil/posts">Meus posts</Link>
                                </li>
                                <li>
                                    <Link href="/perfil">Perfil</Link>
                                </li>
                                <li>
                                    <button onClick={() => signOut()}>
                                        Sair
                                    </button>
                                </li>
                            </ul>
                        </Dropdown>
                    </div>
                ) : (
                    <div className="flex items-center gap-2 text-sm font-medium">
                        <Link
                            href="/login"
                            className="transition-all hover:text-zinc-400"
                        >
                            Login
                        </Link>
                        <Link
                            href="/cadastro"
                            className="transition-all hover:text-zinc-400"
                        >
                            Cadastrar
                        </Link>
                    </div>
                )}
            </div>
        </header>
    );
}

export default trpc.withTRPC(MyApp);
