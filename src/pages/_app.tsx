import type { AppType } from "next/app";
import type { Session } from "next-auth";
import { SessionProvider, signOut, useSession } from "next-auth/react";
import { trpc } from "../utils/trpc";
import "../styles/globals.css";
import Link from "next/link";
import { useRouter } from "next/router";
import classNames from "classnames";
import Dropdown from "../components/headlessui/Dropdown";
import { IoNewspaperOutline } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { useEffect } from "react";
import NProgress from "nprogress";
import { AiOutlineHome } from "react-icons/ai";

export const HEADER_HEIGHT = "64px";

const MyApp: AppType<{ session: Session | null }> = ({
    Component,
    pageProps: { session, ...pageProps },
}) => {
    const router = useRouter();

    NProgress.configure({ showSpinner: false });

    useEffect(() => {
        function handleChangeStart() {
            NProgress.start();
        }

        function handleChangeComplete() {
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
            <nav>
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
            </nav>
            <div className="text-sm font-medium">
                {session ? (
                    <div className="flex items-center gap-1">
                        <Dropdown
                            button={
                                <div className="rounded-md bg-gray-100 p-2">
                                    <FaUser className="text-zinc-800" />
                                </div>
                            }
                        >
                            <ul className="flex flex-col divide-y font-normal text-zinc-700">
                                <li>
                                    <Link
                                        className="mx-2 my-2 flex items-center gap-2 rounded-md px-2 py-1 hover:bg-gray-100"
                                        href={`/${session.user?.name}`}
                                    >
                                        <AiOutlineHome size={16} />
                                        {session.user?.name}
                                    </Link>
                                </li>
                                <div>
                                    <li>
                                        <Link
                                            className="mx-2 mt-2 flex items-center gap-2 rounded-md px-2 py-1 hover:bg-gray-100"
                                            href="/publicar"
                                        >
                                            Publicar novo conteúdo
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            className="mx-2 mb-2 flex items-center gap-2 rounded-md px-2 py-1 hover:bg-gray-100"
                                            href="/perfil"
                                        >
                                            Editar perfil
                                        </Link>
                                    </li>
                                </div>
                                <li>
                                    <span
                                        className="my-2 mx-2 flex cursor-pointer items-center gap-2 rounded-md px-2 py-1 text-red-500 hover:bg-red-100/50"
                                        onClick={() => signOut()}
                                    >
                                        Deslogar
                                    </span>
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
