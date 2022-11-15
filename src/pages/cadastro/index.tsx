import Head from "next/head";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {IoWarning} from "react-icons/io5";
import classNames from "classnames";
import {CgSpinner} from "react-icons/cg";
import {useState} from "react";
import {trpc} from "~/utils/trpc";
import {Outputs} from "~/types/trpc";

const cadastroSchema = z.object({
    username: z
        .string()
        .min(3, "\"username\" deve conter no mínimo 3 caracteres")
        .max(100, "\"username\" deve conter no máximo 100 caracteres")
        .regex(/^[a-zA-Z0-9_]+$/, "\"username\" deve conter apenas letras, números e _"),
    email: z.string().email("\"email\" deve ser válido"),
    // password must contain at least one uppercase letter, one digit, one special caracter, and be at least 8 characters long
    password: z
        .string()
        .regex(
            /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
            "\"senha\" deve conter pelo menos uma letra maiúscula, um dígito, um caractere especial e ter pelo menos 8 caracteres"
        ),
});

interface CadastroFormData {
    username: string;
    email: string;
    password: string;
}

export default function CadastroPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [res, setRes] = useState<Outputs["auth"]["register"] | null>(null);
    const {register, handleSubmit, formState} = useForm<CadastroFormData>({
        resolver: zodResolver(cadastroSchema),
        criteriaMode: "all",
    });
    const {mutateAsync: createUser} = trpc.auth.register.useMutation({
        onError: (err) => setError(err.message),
    });

    async function onSubmit(data: CadastroFormData) {
        setError(null);
        setIsLoading(true);
        try {
            const res = await createUser(data);
            setRes(res);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            <Head>
                <title>{res?.ok ? "Confirme seu email" : "Cadastro"}</title>
            </Head>
            {!res ? <main className="mt-8 flex flex-col items-center">
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
                        Cadastro
                    </h1>
                    <div className="-mx-3 mb-6 flex flex-wrap">
                        <div className="mb-6 w-full px-3 md:w-full">
                            <label
                                className="mb-1 block text-sm font-medium tracking-wide text-gray-700"
                                htmlFor="name"
                            >
                                Nome de usuário
                            </label>
                            <input
                                className={classNames(
                                    "block w-full appearance-none rounded-md border border-gray-300 py-3 px-3 leading-tight text-gray-700 focus:outline-blue-500",
                                    {
                                        "border-red-500":
                                        formState.errors.username,
                                    }
                                )}
                                type="text"
                                {...register("username", {required: true})}
                            />
                            {formState.errors.username && (
                                <div
                                    className="mt-1 flex text-[12px] font-medium text-red-500">
                                    <IoWarning className="text-lg"/>
                                    {formState.errors.username?.message}
                                </div>
                            )}
                        </div>
                        <div className="mb-6 w-full px-3 md:w-full">
                            <label
                                className="mb-1 block text-sm font-medium tracking-wide text-gray-700"
                                htmlFor="email"
                            >
                                Email
                            </label>
                            <input
                                className={classNames(
                                    "block w-full appearance-none rounded-md border border-gray-300 py-3 px-3 leading-tight text-gray-700 focus:outline-blue-500",
                                    {
                                        "border-red-500":
                                        formState.errors.email,
                                    }
                                )}
                                type="email"
                                {...register("email", {required: true})}
                            />
                            {formState.errors.email && (
                                <div
                                    className="mt-1 flex text-[12px] font-medium text-red-500">
                                    <IoWarning className="text-lg"/>
                                    {formState.errors.email?.message}
                                </div>
                            )}
                        </div>
                        <div className="mb-6 w-full px-3 md:w-full">
                            <label
                                className="mb-1 block text-sm font-medium tracking-wide text-gray-700"
                                htmlFor="senha"
                            >
                                Senha
                            </label>
                            <input
                                className={classNames(
                                    "block w-full appearance-none rounded-md border border-gray-300 py-3 px-3 leading-tight text-gray-700 focus:outline-blue-500",
                                    {
                                        "border-red-500":
                                        formState.errors.password,
                                    }
                                )}
                                type="password"
                                {...register("password", {required: true})}
                            />
                            {formState.errors.password && (
                                <div
                                    className="mt-1 flex text-[12px] font-medium text-red-500">
                                    <IoWarning className="text-2xl"/>
                                    {formState.errors.password?.message}
                                </div>
                            )}
                        </div>
                        <div className="w-full px-3 md:w-full">
                            <button
                                disabled={isLoading}
                                type="submit"
                                className={classNames(
                                    "btn-green relative w-full font-medium text-white",
                                    {
                                        "cursor-not-allowed bg-green-700":
                                        isLoading,
                                    }
                                )}
                            >
                                Criar cadastro
                                {isLoading && (
                                    <CgSpinner
                                        className="absolute right-2 animate-spin text-lg"/>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </main> : <main className="mt-32 flex flex-col items-center">
                <h1 className="text-3xl text-gray-800 font-medium">
                    Confira seu e-mail: {res.email}
                </h1>
                <p className="mt-1">
                    Você receberá um link para confirmar seu cadastro e ativar a
                    sua conta.
                </p>
            </main>}
        </>
    );
}
