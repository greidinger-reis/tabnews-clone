import { useAutoAnimate } from "@formkit/auto-animate/react";
import classNames from "classnames";
import Markdown from "markdown-to-jsx";
import {
    type ChangeEvent,
    useEffect,
    useState,
    type Dispatch,
    type SetStateAction,
    Fragment,
} from "react";
import { useForm } from "react-hook-form";
import { IoWarning } from "react-icons/io5";
import {
    boldCommand,
    checkedListCommand,
    codeBlockCommand,
    codeCommand,
    headingLevel2Command,
    headingLevel3Command,
    headingLevel4Command,
    italicCommand,
    linkCommand,
    orderedListCommand,
    quoteCommand,
    strikethroughCommand,
    unorderedListCommand,
    useTextAreaMarkdownEditor,
} from "react-mde";
import { trpc } from "~/utils/trpc";
import { RiFullscreenLine } from "react-icons/ri";
import { MdOutlineHelpCenter } from "react-icons/md";
import { Tooltip } from "../Tooltip";
import { IoCloseOutline } from "react-icons/io5";
import { Transition } from "@headlessui/react";
import { HelpTabItem, helpTabItems, helpTabShortcuts } from "../HelpTabIcons";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

export function CommentForm({
    postId,
    parentId,
    replyingToPost,
    isReplying,
    setIsReplying,
}: {
    postId: string;
    parentId?: string;
    replyingToPost?: boolean;
    isReplying: boolean;
    setIsReplying: Dispatch<SetStateAction<boolean>>;
}) {
    const session = useSession();
    const router = useRouter();
    const [fullscreen, setFullscreen] = useState(false);
    const [help, setHelp] = useState(false);
    const [autoAnimate] = useAutoAnimate<HTMLDivElement>();
    const [preview, setPreview] = useState(false);
    const { ref } = useTextAreaMarkdownEditor({
        commandMap: {
            h2: headingLevel2Command,
            h3: headingLevel3Command,
            h4: headingLevel4Command,
            bold: boldCommand,
            italic: italicCommand,
            link: linkCommand,
            quote: quoteCommand,
            strikethrough: strikethroughCommand,
            orderedList: orderedListCommand,
            unorderedList: unorderedListCommand,
            checkedList: checkedListCommand,
            code: codeCommand,
            codeBlock: codeBlockCommand,
        },
    });
    const form = useForm<{
        content: string;
    }>();
    const trpcContext = trpc.useContext();

    //TODO: Add state transition
    const { mutate } = trpc.comments.create.useMutation({
        onSuccess: () => {
            setIsReplying && setIsReplying(false);
            form.reset();
            trpcContext.comments.list.invalidate({ postId });
        },
    });

    async function submitComment(data: { content: string }) {
        mutate({ postId, parentId, content: data.content });
    }

    useEffect(() => {
        form.register("content", { required: true });
    });

    return (
        <div ref={autoAnimate}>
            {isReplying ? (
                <div
                    className={classNames("", {
                        "flex w-full flex-col": replyingToPost && !fullscreen,
                        "rounded-md border border-zinc-300 py-4 px-3 sm:m-2 sm:px-6":
                            !replyingToPost && !fullscreen,

                        "fixed inset-0 z-10": fullscreen,
                    })}
                >
                    <div
                        className={classNames("relative", {
                            "rounded-md border focus-within:outline focus-within:outline-2":
                                !fullscreen,
                            "h-full": fullscreen,
                            "border-red-500 focus-within:outline-red-500/50":
                                form.formState.errors.content,
                            "border-zinc-300 focus-within:outline-blue-500":
                                !form.formState.errors.content,
                        })}
                    >
                        <div className="flex items-center justify-between rounded-t-md border-b border-zinc-300 bg-gray-100 px-4 py-2 text-sm">
                            <div className="space-x-3">
                                <button
                                    className={`transition-all ${
                                        preview ? "" : "text-blue-500"
                                    }`}
                                    onClick={() => setPreview(false)}
                                >
                                    Escrever
                                </button>
                                <button
                                    className={`transition-all ${
                                        preview ? "text-blue-500" : ""
                                    }`}
                                    onClick={() => setPreview(true)}
                                >
                                    Visualizar
                                </button>
                            </div>
                            <div className="flex items-center gap-3">
                                <Tooltip message="Ajuda">
                                    <button
                                        onClick={() => setHelp(!help)}
                                        className="rounded-md p-1 hover:bg-gray-200"
                                    >
                                        <MdOutlineHelpCenter size={16} />
                                    </button>
                                </Tooltip>
                                <Tooltip message="Tela cheia">
                                    <button
                                        className="rounded-md p-1 hover:bg-gray-200"
                                        onClick={() =>
                                            setFullscreen(!fullscreen)
                                        }
                                    >
                                        <RiFullscreenLine />
                                    </button>
                                </Tooltip>
                            </div>
                        </div>
                        <div className="relative h-full overflow-x-hidden">
                            <div
                                className={classNames(
                                    "prose min-h-[192px] max-w-none rounded-b-md bg-white p-4 prose-headings:my-0 prose-headings:pb-2 prose-h1:border-b prose-h2:border-b prose-p:leading-normal",
                                    {
                                        hidden: !preview,
                                        "h-full": fullscreen,
                                    }
                                )}
                            >
                                <Markdown
                                    options={{ disableParsingRawHTML: true }}
                                >
                                    {form.getValues("content") ?? ""}
                                </Markdown>
                            </div>
                            <form
                                className={classNames(
                                    "flex h-full flex-col gap-4",
                                    {
                                        hidden: preview,
                                    }
                                )}
                            >
                                <textarea
                                    name="content"
                                    rows={8}
                                    ref={ref}
                                    className="bg-base-100 h-full resize-none rounded-b-md p-4 font-mono text-sm outline-none"
                                    onChange={(
                                        e: ChangeEvent<HTMLTextAreaElement>
                                    ) => {
                                        form.setValue(
                                            "content",
                                            e.target.value
                                        );
                                    }}
                                />
                            </form>
                            <HelpTab open={help} setOpen={setHelp} />
                        </div>
                    </div>
                    {form.formState.errors.content && (
                        <div className="mt-1 flex font-medium text-red-500">
                            <IoWarning size={16} />{" "}
                            <p className="text-xs">
                                &quot;body&quot; é um campo obrigatório
                            </p>
                        </div>
                    )}
                    <div className="ml-auto mt-4 flex gap-4 text-sm">
                        <button onClick={() => setIsReplying(false)}>
                            Cancelar
                        </button>
                        <button
                            onClick={form.handleSubmit(submitComment)}
                            className="btn-sm-green font-medium text-white"
                        >
                            Publicar
                        </button>
                    </div>
                </div>
            ) : (
                <button
                    className={`btn-gray my-2 w-fit text-sm font-medium ${
                        replyingToPost && "ml-1 sm:ml-0"
                    }`}
                    onClick={() => {
                        if (session.status === "unauthenticated") {
                            router.push("/login");
                            return;
                        }
                        setIsReplying(!isReplying);
                    }}
                >
                    Responder
                </button>
            )}
        </div>
    );
}

function HelpTab({
    open,
    setOpen,
}: {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
}) {
    return (
        <Transition
            show={open}
            as={Fragment}
            // open from right to left
            enter="transition ease-out duration-300 transform"
            enterFrom="translate-x-full opacity-0"
            enterTo="translate-x-0 opacity-100"
            // close from left to right
            leave="transition ease-in duration-300 transform"
            leaveFrom="translate-x-0 opacity-100"
            leaveTo="translate-x-full opacity-0"
        >
            <div className="absolute top-0 right-0 h-full bg-white">
                <button
                    className="absolute top-2 right-2"
                    onClick={() => setOpen(false)}
                >
                    <IoCloseOutline size={24} />
                </button>
                <div className="flex flex-col border-l p-4">
                    <h2 className="my-4 font-medium">Referência de Markdown</h2>
                    <ul className="space-y-2">
                        {helpTabItems.map((item, i) => (
                            <HelpTabItem key={i} {...item} />
                        ))}
                    </ul>
                    <h2 className="my-4 font-medium">Atalhos</h2>
                    <ul className="space-y-2">
                        {helpTabShortcuts.map((item, i) => (
                            <HelpTabItem key={i} {...item} />
                        ))}
                    </ul>
                </div>
            </div>
        </Transition>
    );
}
