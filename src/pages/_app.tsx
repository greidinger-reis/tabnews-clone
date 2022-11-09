import type { AppType } from "next/app";
import type { Session } from "next-auth";
import { SessionProvider, signOut, useSession } from "next-auth/react";
import { trpc } from "../utils/trpc";
import "../styles/globals.css";
import Link from "next/link";
import { useRouter } from "next/router";
import classNames from "classnames";
import Dropdown from "../components/headlessui/Dropdown";
import { FiChevronDown } from "react-icons/fi";
import { IoNewspaperOutline } from "react-icons/io5";
import { FaUserCircle } from "react-icons/fa";
import { useEffect } from "react";
import NProgress from "nprogress";

export const HEADER_HEIGHT = "64px";

const MyApp: AppType<{ session: Session | null }> = ({
    Component,
    pageProps: { session, ...pageProps },
}) => {
    const router = useRouter();

    NProgress.configure({ showSpinner: false });

    useEffect(() => {
        function handleChangeStart() {
            console.log("change start");
            NProgress.start();
        }

        function handleChangeComplete() {
            console.log("change complete");
            NProgress.done();
        }

        router.events.on("routeChangeStart", handleChangeStart);
        router.events.on("routeChangeComplete", handleChangeComplete);
    }, [router.events]);

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
            className="flex items-center justify-between gap-4 bg-zinc-800 px-4 text-white"
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
            <div className="text-sm font-medium">
                {session ? (
                    <div className="flex items-center gap-1">
                        <FaUserCircle size={24} />
                        <Dropdown
                            button={
                                <button>
                                    <FiChevronDown className="mt-1" />
                                </button>
                            }
                        >
                            <ul className="space-y-1 text-zinc-700">
                                <li className="hover:text-zinc-400">
                                    <Link href={`/${session.user?.name}`}>
                                        {session.user?.name}
                                    </Link>
                                </li>
                                <li className="hover:text-zinc-400">
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
