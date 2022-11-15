import classNames from "classnames";
import Markdown from "markdown-to-jsx";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
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
import { trpc } from "../../utils/trpc";

export function CommentForm({
    postId,
    parentId,
    setIsReplying,
}: {
    postId: string;
    parentId?: string;
    setIsReplying?: (value: boolean) => void;
}) {
    const [comment, setComment] = useState("");
    const { ref, commandController } = useTextAreaMarkdownEditor({
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
    const [preview, setPreview] = useState(false);
    const { register, handleSubmit, reset, setValue, getValues } = useForm<{
        content: string;
    }>();
    const trpcContext = trpc.useContext();

    //TODO: Add state transition
    const { mutate } = trpc.comments.create.useMutation({
        onSuccess: () => {
            setComment("");
            setIsReplying && setIsReplying(false);
            reset();
            trpcContext.comments.list.invalidate({ postId });
        },
    });

    async function submitComment(data: { content: string }) {
        const { content } = data;
        mutate({ postId, parentId, content });
    }

    useEffect(() => {
        register("content", { required: true });
    });

    return (
        <div className="group mx-auto flex max-w-4xl flex-col rounded-md border border-zinc-300 px-6 py-4">
            <div className="overflow-hidden rounded-md border border-zinc-300 focus-within:outline focus-within:outline-2 focus-within:outline-blue-500">
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
                        {getValues("content") ?? ""}
                    </Markdown>
                </div>
                <form
                    onSubmit={handleSubmit(submitComment)}
                    className={classNames("flex flex-col gap-4", {
                        hidden: preview,
                    })}
                >
                    <textarea
                        rows={6}
                        name="content"
                        value={comment}
                        ref={ref}
                        onChange={(e) => {
                            setComment(e.target.value);
                            setValue("content", e.target.value);
                        }}
                        className="bg-base-100 resize-none p-4 outline-none"
                    />
                </form>
            </div>
            <div className="ml-auto mt-4 flex gap-4 text-sm">
                <button>Cancelar</button>
                <button
                    className="btn-sm-green font-medium text-white"
                    type="submit"
                >
                    Publicar
                </button>
            </div>
        </div>
    );
}
