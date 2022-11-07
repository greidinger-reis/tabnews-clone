import classNames from "classnames";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
    boldCommand,
    checkedListCommand,
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
    codeBlockCommand,
    codeCommand,
} from "react-mde";
import { trpc } from "../../utils/trpc";
import CommentFormButtons from "./CommentEditorButtons";
import { CommentFormContext } from "./context";

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
    const [editorButtonsShown, setEditorButtonsShown] = useState(false);
    const { register, handleSubmit, reset, setValue } = useForm<{
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
        <CommentFormContext.Provider value={{ commandController }}>
            <div className="group flex flex-col rounded">
                {editorButtonsShown ? <CommentFormButtons /> : null}
                <form
                    onSubmit={handleSubmit(submitComment)}
                    className="flex flex-col gap-4"
                >
                    <textarea
                        rows={4}
                        name="content"
                        value={comment}
                        onFocus={() => setEditorButtonsShown(true)}
                        ref={ref}
                        onChange={(e) => {
                            setComment(e.target.value);
                            setValue("content", e.target.value);
                        }}
                        className={classNames(
                            "bg-base-100 resize-none border border-zinc-400 p-4 outline-none focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white",
                            {
                                rounded: !editorButtonsShown,
                                "rounded-b": editorButtonsShown,
                            }
                        )}
                        placeholder="Comment"
                    />
                    <button className="btn-green" type="submit">
                        Publicar
                    </button>
                </form>
            </div>
        </CommentFormContext.Provider>
    );
}
