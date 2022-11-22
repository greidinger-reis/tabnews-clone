import classNames from "classnames";
import Markdown from "markdown-to-jsx";
import {
    Fragment,
    type ChangeEvent,
    type Dispatch,
    type SetStateAction,
} from "react";
import { IoWarning } from "react-icons/io5";
import { RiFullscreenLine } from "react-icons/ri";
import { MdOutlineHelpCenter } from "react-icons/md";
import { Tooltip } from "../Tooltip";
import { IoCloseOutline } from "react-icons/io5";
import { Transition } from "@headlessui/react";
import { HelpTabItem, helpTabItems, helpTabShortcuts } from "../HelpTabIcons";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEditor } from "./hooks/useEditor";
import { useAutoAnimate } from "@formkit/auto-animate/react";

export function Editor(props: {
    postId: string;
    parentId?: string;
    replyingToPost?: boolean;
    isReplying: boolean;
    setIsReplying: Dispatch<SetStateAction<boolean>>;
    isUpdating?: boolean;
    content?: string;
    commentId?: string;
}) {
    const session = useSession();
    const router = useRouter();
    const [autoAnimate] = useAutoAnimate<HTMLDivElement>();

    const {
        MDERef,
        dispatchEditorState,
        editorState,
        form,
        handleShortcuts,
        submitComment,
    } = useEditor({ ...props });

    return (
        <div ref={autoAnimate}>
            {props.isReplying ? (
                <div
                    className={classNames("", {
                        "flex w-full flex-col":
                            props.replyingToPost && !editorState.isFullscreen,
                        "rounded-md border border-zinc-300 py-4 px-3 sm:m-2 sm:px-6":
                            !props.replyingToPost && !editorState.isFullscreen,

                        "fixed inset-0 z-10": editorState.isFullscreen,
                    })}
                >
                    <div
                        className={classNames("relative", {
                            "rounded-md border focus-within:outline focus-within:outline-2":
                                !editorState.isFullscreen,
                            "h-full": editorState.isFullscreen,
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
                                    "rounded-t-md": !editorState.isFullscreen,
                                }
                            )}
                        >
                            <div className="space-x-3">
                                <button
                                    className={`transition-all ${
                                        editorState.isPreviewTabShown
                                            ? ""
                                            : "text-blue-500"
                                    }`}
                                    onClick={() => {
                                        editorState.isPreviewTabShown &&
                                            dispatchEditorState({
                                                type: "TOGGLE_PREVIEW_TAB",
                                            });
                                    }}
                                >
                                    Escrever
                                </button>
                                <button
                                    className={`transition-all ${
                                        editorState.isPreviewTabShown
                                            ? "text-blue-500"
                                            : ""
                                    }`}
                                    onClick={() => {
                                        !editorState.isPreviewTabShown &&
                                            dispatchEditorState({
                                                type: "TOGGLE_PREVIEW_TAB",
                                            });
                                    }}
                                >
                                    Visualizar
                                </button>
                            </div>
                            <div className="flex items-center gap-3">
                                <Tooltip message="Ajuda">
                                    <button
                                        onClick={() =>
                                            dispatchEditorState({
                                                type: "TOGGLE_HELP_TAB",
                                            })
                                        }
                                        className="rounded-md p-1 hover:bg-gray-200"
                                    >
                                        <MdOutlineHelpCenter size={16} />
                                    </button>
                                </Tooltip>
                                <Tooltip message="Tela cheia">
                                    <button
                                        className="rounded-md p-1 hover:bg-gray-200"
                                        onClick={() =>
                                            dispatchEditorState({
                                                type: "TOGGLE_FULLSCREEN",
                                            })
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
                                        hidden: !editorState.isPreviewTabShown,
                                        "h-full": editorState.isFullscreen,
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
                                        hidden: editorState.isPreviewTabShown,
                                    }
                                )}
                            >
                                <textarea
                                    defaultValue={
                                        (props.isUpdating && props.content) ||
                                        ""
                                    }
                                    name="content"
                                    rows={8}
                                    ref={MDERef}
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
                                open={editorState.isHelpTabShown}
                                setOpen={() => {
                                    !editorState.isHelpTabShown &&
                                        dispatchEditorState({
                                            type: "TOGGLE_HELP_TAB",
                                        });
                                }}
                                fullscreen={editorState.isFullscreen}
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
                        <button onClick={() => props.setIsReplying(false)}>
                            Cancelar
                        </button>
                        <button
                            disabled={editorState.isSubmitting}
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
                        props.replyingToPost && "ml-1 sm:ml-0"
                    }`}
                    onClick={() => {
                        if (session.status === "unauthenticated") {
                            router.push("/login");
                            return;
                        }
                        props.setIsReplying(!props.isReplying);
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
