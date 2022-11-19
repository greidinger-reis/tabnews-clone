import { useAutoAnimate } from "@formkit/auto-animate/react";
import classNames from "classnames";
import Markdown from "markdown-to-jsx";
import {
    Fragment,
    useEffect,
    useState,
    type ChangeEvent,
    type Dispatch,
    type SetStateAction,
    type KeyboardEvent,
} from "react";
import { useForm } from "react-hook-form";
import { IoWarning } from "react-icons/io5";
import {
    boldCommand,
    codeBlockCommand,
    codeCommand,
    italicCommand,
    linkCommand,
    orderedListCommand,
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
    isUpdating,
    content,
    id,
}: {
    postId: string;
    parentId?: string;
    replyingToPost?: boolean;
    isReplying: boolean;
    setIsReplying: Dispatch<SetStateAction<boolean>>;
    isUpdating?: boolean;
    content?: string;
    id?: string;
}) {
    const session = useSession();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [fullscreen, setFullscreen] = useState(false);
    const [help, setHelp] = useState(false);
    const [autoAnimate] = useAutoAnimate<HTMLDivElement>();
    const [preview, setPreview] = useState(false);
    const { ref, commandController } = useTextAreaMarkdownEditor({
        commandMap: {
            bold: boldCommand,
            italic: italicCommand,
            link: linkCommand,
            orderedList: orderedListCommand,
            unorderedList: unorderedListCommand,
            code: codeCommand,
            codeBlock: codeBlockCommand,
        },
    });
    const form = useForm<{
        content: string;
    }>();
    const trpcContext = trpc.useContext();

    //TODO: Add state transition
    const { mutateAsync: createComment } = trpc.comments.create.useMutation({
        onSuccess: () => {
            setIsReplying && setIsReplying(false);
            setIsSubmitting(false);
            form.reset();
            trpcContext.comments.list.invalidate({ postId });
        },
    });

    const { mutateAsync: updateComment } = trpc.comments.update.useMutation({
        onSuccess: () => {
            setIsReplying && setIsReplying(false);
            setIsSubmitting(false);
            form.reset();
            trpcContext.comments.list.invalidate({ postId });
        },
    });

    async function submitComment(data: { content: string }) {
        setIsSubmitting(true);

        if (isUpdating) {
            if (!id) return;
            await updateComment({ id, content: data.content });
            return;
        }

        await createComment({
            postId,
            parentId,
            content: data.content,
        });
    }

    function handleShortcuts(e: KeyboardEvent) {
        if (e.ctrlKey) {
            switch (e.key) {
                case "b":
                    e.preventDefault();
                    commandController.executeCommand("bold");
                    break;
                case "i":
                    e.preventDefault();
                    commandController.executeCommand("italic");
                    break;
                case "k":
                    e.preventDefault();
                    commandController.executeCommand("link");
                    break;
            }
        }
        if (e.ctrlKey && e.shiftKey) {
            switch (e.key) {
                case "K":
                    e.preventDefault();
                    commandController.executeCommand("code");
                    break;
                case "C":
                    e.preventDefault();
                    commandController.executeCommand("codeBlock");
                    break;
                case "U":
                    e.preventDefault();
                    commandController.executeCommand("unorderedList");
                    break;
                case "O":
                    e.preventDefault();
                    commandController.executeCommand("orderedList");
                    break;
            }
        }
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
                        <div
                            className={classNames(
                                "flex items-center justify-between  border-b border-zinc-300 bg-gray-100 px-4 py-2 text-sm",
                                {
                                    "rounded-t-md": !fullscreen,
                                }
                            )}
                        >
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
                            <div
                                className={classNames(
                                    "flex h-full flex-col gap-4",
                                    {
                                        hidden: preview,
                                    }
                                )}
                            >
                                <textarea
                                    defaultValue={(isUpdating && content) || ""}
                                    name="content"
                                    rows={8}
                                    ref={ref}
                                    className="h-full resize-none rounded-b-md p-4 font-mono text-sm outline-none"
                                    onChange={(
                                        e: ChangeEvent<HTMLTextAreaElement>
                                    ) => {
                                        form.setValue(
                                            "content",
                                            e.target.value
                                        );
                                    }}
                                    onKeyDown={handleShortcuts}
                                />
                            </div>
                            <HelpTab
                                open={help}
                                setOpen={setHelp}
                                fullscreen={fullscreen}
                            />
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
                            disabled={isSubmitting}
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
    fullscreen,
}: {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    fullscreen: boolean;
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
            <div className="absolute top-0 right-0 bg-white">
                <div
                    className={classNames("flex flex-col border-l p-4", {
                        "h-full": fullscreen,
                        "h-48 overflow-y-scroll": !fullscreen,
                    })}
                >
                    <button className="ml-auto" onClick={() => setOpen(false)}>
                        <IoCloseOutline size={24} />
                    </button>
                    <h2 className="mb-4 font-medium">Referência de Markdown</h2>
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
