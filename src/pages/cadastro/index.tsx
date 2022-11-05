import { signIn } from "next-auth/react";
import { AiFillGithub, AiOutlineTwitter } from "react-icons/ai";
import { FaDiscord } from "react-icons/fa";
import { HEADER_HEIGHT } from "../_app";

export default function CadastroPage() {
    return (
        <div
            className="flex flex-col items-center justify-center"
            style={{ height: `calc(100vh - ${HEADER_HEIGHT})` }}
        >
            <div className="my-2 mx-4 flex justify-center md:mx-0">
                <form className="w-full max-w-xl rounded bg-white p-6 shadow-md">
                    <h1 className="mb-4 text-center text-4xl font-bold tracking-tight text-zinc-700">
                        Cadastrar
                    </h1>
                    <div className="-mx-3 mb-6 flex flex-wrap">
                        <div className="mb-6 w-full px-3 md:w-full">
                            <label
                                className="ml-1 mb-1 block text-sm font-medium tracking-wide text-gray-700"
                                htmlFor="name"
                            >
                                Nome de usuário
                            </label>
                            <input
                                id="name"
                                className="block w-full appearance-none rounded border border-gray-400 bg-white py-3 px-3 leading-tight text-gray-700 focus:outline-none"
                                type="text"
                                placeholder="Seu nome/nickname"
                                required
                            />
                        </div>
                        <div className="mb-6 w-full px-3 md:w-full">
                            <label
                                className="ml-1 mb-1 block text-sm font-medium tracking-wide text-gray-700"
                                htmlFor="email"
                            >
                                Email
                            </label>
                            <input
                                id="email"
                                className="block w-full appearance-none rounded border border-gray-400 bg-white py-3 px-3 leading-tight text-gray-700 focus:outline-none"
                                type="email"
                                placeholder="Seu email"
                                required
                            />
                        </div>
                        <div className="mb-6 w-full px-3 md:w-full">
                            <label
                                className="ml-1 mb-1 block text-sm font-medium tracking-wide text-gray-700"
                                htmlFor="password"
                            >
                                Password
                            </label>
                            <input
                                id="password"
                                className="block w-full appearance-none rounded border border-gray-400 bg-white py-3 px-3 leading-tight text-gray-700 focus:outline-none"
                                type="password"
                                placeholder="Uma senha forte"
                                required
                            />
                        </div>
                        <div className="w-full px-3 md:w-full">
                            <button className="block w-full appearance-none rounded border border-gray-200 bg-green-600 py-3 px-3 font-semibold leading-tight text-gray-100 transition-all hover:bg-green-700 focus:border-gray-500 focus:bg-white focus:outline-none">
                                Criar cadastro
                            </button>
                        </div>
                        <div className="relative mt-6 flex w-full items-center justify-center">
                            <span className="z-10 bg-white px-4 text-xs text-gray-700">
                                ou entre com
                            </span>
                            <div className="absolute h-[1px] w-11/12 bg-zinc-500" />
                        </div>
                        <div className="mt-4 flex w-full items-center justify-center gap-4">
                            <button
                                type="button"
                                className="rounded border border-zinc-400 bg-gray-100 p-8 py-2 transition-all hover:bg-gray-200"
                            >
                                <AiFillGithub className="text-2xl text-zinc-600" />
                            </button>
                            <button
                                type="button"
                                className="rounded border border-zinc-400 bg-gray-100 p-8 py-2 transition-all hover:bg-gray-200"
                            >
                                <AiOutlineTwitter className="text-2xl text-zinc-600" />
                            </button>
                            <button
                                type="button"
                                onClick={() => signIn("discord")}
                                className="rounded border border-zinc-400 bg-gray-100 p-8 py-2 transition-all hover:bg-gray-200"
                            >
                                <FaDiscord className="text-2xl text-zinc-600" />
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
