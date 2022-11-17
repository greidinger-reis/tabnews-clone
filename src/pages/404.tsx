import Link from "next/link";
import { IoNewspaperOutline } from "react-icons/io5";
import { HEADER_HEIGHT } from "./_app";

export default function NotFoundPage() {
    return (
        <div
            className="flex flex-col items-center justify-center gap-4"
            style={{ height: `calc(100vh - ${HEADER_HEIGHT})` }}
        >
            <div className="flex gap-4 divide-x text-4xl font-bold">
                <IoNewspaperOutline />
                <span className="pl-4">404</span>
            </div>
            <h1 className="text-3xl font-bold">Página não encontrada</h1>
            <Link className="text-blue-500" href="/">
                Retornar à tela inicial
            </Link>
        </div>
    );
}
