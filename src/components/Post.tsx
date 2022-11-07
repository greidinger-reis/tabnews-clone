import type { Outputs } from "~/types/trpc";
import { formatDistance } from "date-fns";
import { ptBR } from "date-fns/locale";
import Markdown from "markdown-to-jsx";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";

type PostQueryOutput = Outputs["posts"]["findById"];

const queries = "lg:3/4 w-full sm:w-4/5 2xl:w-1/2";
export function Post({ post }: { post: PostQueryOutput }) {
    return (
        <div className="flex flex-col items-center">
            <div className={"mt-8 flex " + queries}>
                <aside className="h-full px-4 pt-4">
                    <div className="flex flex-col items-center gap-2">
                        <button>
                            <BsChevronUp className="text-sm" />
                        </button>
                        <span className="text-[12px] font-medium text-blue-500">
                            {post.score}
                        </span>
                        <button>
                            <BsChevronDown className="text-sm" />
                        </button>
                    </div>
                </aside>

                <div>
                    <span className="rounded-md bg-[#ddf4ff] px-2 py-1 font-mono text-[12px] text-blue-500">
                        {post.author.name}
                    </span>
                    <span className="ml-2 text-[12px]">
                        {formatDistance(new Date(post.createdAt), new Date(), {
                            locale: ptBR,
                        })}{" "}
                        atrás
                    </span>
                    <p className="mt-2 text-4xl font-semibold">{post.title}</p>
                </div>
            </div>
            <main
                className={
                    "prose mt-2 ml-[44px] max-w-none border-l border-dotted border-zinc-300 pl-6 " +
                    queries
                }
            >
                <Markdown>{post.content}</Markdown>
            </main>
        </div>
    );
}
