import { Transition } from "@headlessui/react";
import classNames from "classnames";
import Markdown from "markdown-to-jsx";
import dynamic from "next/dynamic";
import {
    Fragment,
    type ChangeEvent,
    type Dispatch,
    type SetStateAction,
} from "react";
import { IoCloseOutline, IoWarning } from "react-icons/io5";
import { MdOutlineHelpCenter } from "react-icons/md";
import { RiFullscreenLine } from "react-icons/ri";
import { HelpTabItem, helpTabItems, helpTabShortcuts } from "../HelpTabIcons";
import { Tooltip } from "../Tooltip";
import type { UseEditor } from "./hooks/useEditor";

export function Editor({
    editor,
}: {
    editor?: UseEditor & {
        replyingToPost?: boolean;
        isReplying?: boolean;
        setIsReplying?: Dispatch<SetStateAction<boolean>>;
        isUpdating?: boolean;
        contentToUpdate?: string;
    };
}) {
    function handleSubmit() {
        if (editor?.commentForm) {
            editor.commentForm.handleSubmit(editor?.submitComment);
            return;
        }
    }

    const PreBlock = dynamic(() => import("./Code"), { ssr: false });

    return (
        <div
            className={classNames("", {
                "flex w-full flex-col":
                    editor?.replyingToPost && !editor.editorState.isFullscreen,
                "rounded-md border border-zinc-300 py-4 px-3 sm:m-2 sm:px-6":
                    !editor?.replyingToPost &&
                    !editor?.editorState.isFullscreen,

                "fixed inset-0 z-10": editor?.editorState.isFullscreen,
            })}
        >
            <div
                className={classNames("relative", {
                    "rounded-md border focus-within:outline focus-within:outline-2":
                        !editor?.editorState.isFullscreen,
                    "h-full": editor?.editorState.isFullscreen,
                    "border-red-500 focus-within:outline-red-500/50":
                        editor?.commentForm?.formState.errors.content,
                    "border-zinc-300 focus-within:outline-blue-500":
                        !editor?.commentForm?.formState.errors.content,
                })}
            >
                <div
                    className={classNames(
                        "flex items-center justify-between  border-b border-zinc-300 bg-gray-100 px-4 py-2 text-sm",
                        {
                            "rounded-t-md": !editor?.editorState.isFullscreen,
                        }
                    )}
                >
                    <div className="space-x-3">
                        <button
                            className={`transition-all ${
                                editor?.editorState.isPreviewTabShown
                                    ? ""
                                    : "text-blue-500"
                            }`}
                            onClick={() => {
                                editor?.editorState.isPreviewTabShown &&
                                    editor?.dispatchEditorState({
                                        type: "TOGGLE_PREVIEW_TAB",
                                    });
                            }}
                        >
                            Escrever
                        </button>
                        <button
                            className={`transition-all ${
                                editor?.editorState.isPreviewTabShown
                                    ? "text-blue-500"
                                    : ""
                            }`}
                            onClick={() => {
                                !editor?.editorState.isPreviewTabShown &&
                                    editor?.dispatchEditorState({
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
                                    editor?.dispatchEditorState({
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
                                    editor?.dispatchEditorState({
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
                            "prose max-w-none rounded-b-md bg-white p-4 prose-headings:my-0 prose-headings:pb-2 prose-h1:border-b prose-h2:border-b prose-p:leading-normal",
                            {
                                "min-h-[192px]": editor?.commentForm,
                                "h-[40vh]": editor?.postForm,
                                hidden: !editor?.editorState.isPreviewTabShown,
                                "h-full": editor?.editorState.isFullscreen,
                            }
                        )}
                    >
                        <Markdown
                            options={{
                                disableParsingRawHTML: true,
                                overrides: {
                                    pre: {
                                        component: PreBlock,
                                    },
                                },
                            }}
                        >
                            {editor?.commentForm
                                ? editor?.commentForm?.getValues("content") ??
                                  ""
                                : editor?.postForm?.getValues("content") ?? ""}
                        </Markdown>
                    </div>
                    <div
                        className={classNames("flex h-full flex-col gap-4", {
                            hidden: editor?.editorState.isPreviewTabShown,
                        })}
                    >
                        <textarea
                            defaultValue={
                                (editor?.isUpdating &&
                                    editor?.contentToUpdate) ||
                                ""
                            }
                            name="content"
                            ref={editor?.MDERef}
                            className={classNames(
                                "resize-none rounded-b-md p-4 font-mono text-sm outline-none",
                                {
                                    "min-h-[192px]": editor?.commentForm,
                                    "h-[40vh]": editor?.postForm,
                                }
                            )}
                            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
                                editor?.commentForm?.setValue(
                                    "content",
                                    e.target.value
                                );
                                editor?.postForm?.setValue(
                                    "content",
                                    e.target.value
                                );
                            }}
                            onKeyDown={editor?.handleShortcuts}
                        />
                    </div>
                    <HelpTab
                        open={editor?.editorState.isHelpTabShown ?? false}
                        setOpen={() => {
                            editor?.editorState.isHelpTabShown &&
                                editor?.dispatchEditorState({
                                    type: "TOGGLE_HELP_TAB",
                                });
                        }}
                        fullscreen={editor?.editorState.isFullscreen ?? false}
                        isPostEditor={editor?.postForm ? true : false}
                    />
                </div>
            </div>
            {editor?.commentForm?.formState.errors.content && (
                <div className="mt-1 flex font-medium text-red-500">
                    <IoWarning size={16} />{" "}
                    <p className="text-xs">
                        &quot;body&quot; é um campo obrigatório
                    </p>
                </div>
            )}
            {editor?.commentForm && (
                <div className="mt-4 flex justify-end gap-4 text-sm">
                    <button
                        onClick={() => {
                            if (!editor?.setIsReplying) return;
                            editor?.setIsReplying(false);
                        }}
                    >
                        Cancelar
                    </button>
                    <button
                        disabled={editor?.editorState.isSubmitting}
                        onClick={handleSubmit}
                        className="btn-sm-green font-medium text-white"
                    >
                        Publicar
                    </button>
                </div>
            )}
        </div>
    );
}

function HelpTab({
    open,
    setOpen,
    fullscreen,
    isPostEditor,
}: {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    fullscreen: boolean;
    isPostEditor: boolean;
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
                        "h-[350px] overflow-y-scroll":
                            !fullscreen && isPostEditor,
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
