import {
    type Dispatch,
    type SetStateAction,
    useEffect,
    useReducer,
    type KeyboardEventHandler,
} from "react";
import { useForm } from "react-hook-form";
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
import { editorReducer, INITIAL_STATE } from "./reducer";

export function useEditor({
    postId,
    parentId,
    setIsReplying,
    isUpdating,
    commentId,
}: {
    postId: string;
    parentId?: string;
    setIsReplying: Dispatch<SetStateAction<boolean>>;
    isUpdating?: boolean;
    commentId?: string;
}) {
    const [editorState, dispatchEditorState] = useReducer(
        editorReducer,
        INITIAL_STATE
    );

    const { ref: MDERef, commandController } = useTextAreaMarkdownEditor({
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
            setIsReplying(false);
            dispatchEditorState({ type: "TOGGLE_IS_SUBMITTING" });
            form.reset();
            trpcContext.comments.list.invalidate({ postId });
        },
    });

    const { mutateAsync: updateComment } = trpc.comments.update.useMutation({
        onSuccess: () => {
            setIsReplying(false);
            dispatchEditorState({ type: "TOGGLE_IS_SUBMITTING" });
            form.reset();
            console.log("invalidating comment list of post:", postId);
            trpcContext.comments.list.invalidate({ postId });
        },
    });

    async function submitComment(data: { content: string }) {
        dispatchEditorState({ type: "TOGGLE_IS_SUBMITTING" });

        if (isUpdating) {
            if (!commentId) return;
            await updateComment({ id: commentId, content: data.content });
            return;
        }

        await createComment({
            postId,
            parentId,
            content: data.content,
        });
    }

    const handleShortcuts: KeyboardEventHandler<HTMLTextAreaElement> = (
        event
    ) => {
        if (event.ctrlKey) {
            switch (event.key) {
                case "b":
                    event.preventDefault();
                    commandController.executeCommand("bold");
                    break;
                case "i":
                    event.preventDefault();
                    commandController.executeCommand("italic");
                    break;
                case "k":
                    event.preventDefault();
                    commandController.executeCommand("link");
                    break;
            }
        }
        if (event.ctrlKey && event.shiftKey) {
            switch (event.key) {
                case "K":
                    event.preventDefault();
                    commandController.executeCommand("code");
                    break;
                case "C":
                    event.preventDefault();
                    commandController.executeCommand("codeBlock");
                    break;
                case "U":
                    event.preventDefault();
                    commandController.executeCommand("unorderedList");
                    break;
                case "O":
                    event.preventDefault();
                    commandController.executeCommand("orderedList");
                    break;
            }
        }
    };

    useEffect(() => {
        form.register("content", { required: true });
    });

    return {
        form,
        MDERef,
        editorState,
        handleShortcuts,
        submitComment,
        dispatchEditorState,
    };
}
