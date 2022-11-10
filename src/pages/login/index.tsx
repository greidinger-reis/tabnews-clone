import classNames from "classnames";
import {signIn} from "next-auth/react";
import Head from "next/head";
import {useRouter} from "next/router";
import {useState} from "react";
import {useForm} from "react-hook-form";
import {CgSpinner} from "react-icons/cg";

interface LoginFormData {
    email: string;
    password: string;
}

export default function LoginPage() {
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const {register, handleSubmit} = useForm<LoginFormData>();

    async function onSubmit(data: LoginFormData) {
        setIsLoading(true);
        setError(null);
        const res = await signIn("credentials", {
            redirect: false,
            email: data.email,
            password: data.password,
        });
        if (res?.error) setError(res.error);
        if (res?.ok) router.push("/");
        setIsLoading(false);
    }

    return (
        <>
            <Head>
                <title>Login</title>
            </Head>
            <main className="mt-8 flex flex-col items-center">
                {error && (
                    <div
                        className="relative mb-4 flex w-full max-w-xl justify-center rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700"
                        role="alert"
                    >
                        <strong className="font-medium">{error}</strong>
                    </div>
                )}
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="w-full max-w-xl p-6"
                >
                    <h1 className="mb-4 text-center text-4xl font-medium tracking-tight text-zinc-700">
                        Login
                    </h1>
                    <div className="-mx-3 mb-6 flex flex-wrap">
                        <div className="mb-6 w-full px-3 md:w-full">
                            <label
                                className="mb-1 block text-sm font-medium tracking-wide text-gray-700"
                                htmlFor="email"
                            >
                                Email
                            </label>
                            <input
                                className="block w-full appearance-none rounded-md border border-gray-300 py-3 px-3 leading-tight text-gray-700 focus:outline-none"
                                type="email"
                                {...register("email", {required: true})}
                            />
                        </div>
                        <div className="mb-6 w-full px-3 md:w-full">
                            <label
                                className="mb-1 block text-sm font-medium tracking-wide text-gray-700"
                                htmlFor="password"
                            >
                                Senha
                            </label>
                            <input
                                className="block w-full appearance-none rounded-md border border-gray-300 py-3 px-3 leading-tight text-gray-700 focus:outline-none"
                                type="password"
                                {...register("password", {required: true})}
                            />
                        </div>
                        <div className="w-full px-3 md:w-full">
                            <button
                                disabled={isLoading}
                                className={classNames(
                                    "btn-green relative w-full font-medium text-white",
                                    {
                                        "cursor-not-allowed bg-green-700":
                                        isLoading,
                                    }
                                )}
                            >
                                Login
                                {isLoading && (
                                    <CgSpinner
                                        className="absolute right-2 animate-spin text-lg"/>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </main>
        </>
    );
}
