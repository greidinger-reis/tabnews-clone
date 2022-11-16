import { useAutoAnimate } from "@formkit/auto-animate/react";
import classNames from "classnames";
import Markdown from "markdown-to-jsx";
import { type ChangeEvent, useEffect, useState } from "react";
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
    setIsReplying: (value: boolean) => void;
}) {
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
                    className={
                        replyingToPost
                            ? "flex w-full flex-col"
                            : "group m-2 flex w-full flex-col rounded-md border border-zinc-300 px-6 py-4"
                    }
                >
                    <div
                        className={classNames(
                            "overflow-hidden rounded-md border focus-within:outline focus-within:outline-2 ",
                            {
                                "border-red-500": form.formState.errors.content,
                                "border-zinc-300":
                                    !form.formState.errors.content,
                                "focus-within:outline-blue-500":
                                    !form.formState.errors.content,
                                "focus-within:outline-red-500/50":
                                    form.formState.errors.content,
                            }
                        )}
                    >
                        <div className="space-x-4 border-b border-zinc-300 bg-gray-100 px-4 py-2 text-sm">
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
                        <div
                            className={classNames(
                                "prose min-h-[176px] max-w-none p-4 prose-headings:my-0 prose-h1:text-base prose-h1:font-normal prose-p:leading-normal",
                                {
                                    hidden: !preview,
                                }
                            )}
                        >
                            <Markdown options={{ disableParsingRawHTML: true }}>
                                {form.getValues("content") ?? ""}
                            </Markdown>
                        </div>
                        <form
                            className={classNames("flex flex-col gap-4", {
                                hidden: preview,
                            })}
                        >
                            <textarea
                                name="content"
                                rows={6}
                                ref={ref}
                                className="bg-base-100 resize-none p-4 font-mono text-sm outline-none"
                                onChange={(
                                    e: ChangeEvent<HTMLTextAreaElement>
                                ) => {
                                    form.setValue("content", e.target.value);
                                }}
                            />
                        </form>
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
                    className="btn-gray my-2 w-fit text-sm font-medium"
                    onClick={() => setIsReplying(!isReplying)}
                >
                    Responder
                </button>
            )}
        </div>
    );
}
