import Head from "next/head";
import { NextAuthProviderButtons } from "~/components/NextAuthProviderButtons";

export default function LoginPage() {
    return (
        <>
            <Head>
                <title>Cadastro</title>
            </Head>
            <main className="mt-8 flex justify-center">
                <form className="w-full max-w-xl p-6">
                    <h1 className="mb-4 text-center text-4xl font-medium tracking-tight text-zinc-700">
                        Cadastro
                    </h1>
                    <div className="-mx-3 mb-6 flex flex-wrap">
                        <div className="mb-6 w-full px-3 md:w-full">
                            <label
                                className="mb-1 block text-sm font-medium tracking-wide text-gray-700"
                                htmlFor="username"
                            >
                                Nome de usuário
                            </label>
                            <input
                                name="username"
                                className="block w-full appearance-none rounded-md border border-gray-300 py-3 px-3 leading-tight text-gray-700 focus:outline-none"
                                type="text"
                                required
                            />
                        </div>
                        <div className="mb-6 w-full px-3 md:w-full">
                            <label
                                className="mb-1 block text-sm font-medium tracking-wide text-gray-700"
                                htmlFor="email"
                            >
                                Email
                            </label>
                            <input
                                name="email"
                                className="block w-full appearance-none rounded-md border border-gray-300 py-3 px-3 leading-tight text-gray-700 focus:outline-none"
                                type="email"
                                required
                            />
                        </div>
                        <div className="mb-6 w-full px-3 md:w-full">
                            <label
                                className="mb-1 block text-sm font-medium tracking-wide text-gray-700"
                                htmlFor="senha"
                            >
                                Senha
                            </label>
                            <input
                                name="senha"
                                className="block w-full appearance-none rounded-md border border-gray-300 py-3 px-3 leading-tight text-gray-700 focus:outline-none"
                                type="password"
                                required
                            />
                        </div>
                        <div className="w-full px-3 md:w-full">
                            <button className="btn-green w-full font-medium text-white">
                                Criar cadastro
                            </button>
                        </div>
                        <div className="relative mt-6 flex w-full items-center justify-center">
                            <span className="z-10 bg-white px-4 text-xs text-gray-700">
                                ou entre com
                            </span>
                            <div className="absolute h-[.5px] w-[90%] bg-zinc-300" />
                        </div>
                        <NextAuthProviderButtons />
                    </div>
                </form>
            </main>
        </>
    );
}
