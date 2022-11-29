/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAtom } from "jotai";
import {
    useReducer,
    type Dispatch,
    type KeyboardEventHandler,
    type SetStateAction,
} from "react";
import { type UseFormReturn } from "react-hook-form";
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
import type { PostFormData } from "~/pages/publicar";
import { PostIdAtom } from "~/pages/[userName]/[slug]";
import { trpc } from "~/utils/trpc";
import type { CommentFormData } from "../CommentEditor";
import { editorReducer, INITIAL_STATE } from "./reducer";

export type EditorProps = {
    commentEditor?: {
        commentForm: UseFormReturn<CommentFormData, any>;
        setIsCommenting: Dispatch<SetStateAction<boolean>>;
        parentId?: string;
        isUpdating?: boolean;
        commentIdToUpdate?: string;
    };
    postEditor?: {
        postForm: UseFormReturn<PostFormData, any>;
    };
};

export function useEditor({ commentEditor, postEditor }: EditorProps) {
    const trpcContext = trpc.useContext();
    const [postId] = useAtom(PostIdAtom);

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

    const { mutateAsync: createComment } = trpc.comments.create.useMutation({
        onSuccess: () => {
            if (!commentEditor) return;
            commentEditor?.setIsCommenting(false);
            dispatchEditorState({ type: "TOGGLE_IS_SUBMITTING" });
            commentEditor.commentForm.reset();
            trpcContext.comments.list.invalidate({
                postId,
            });
        },
    });

    const { mutateAsync: updateComment } = trpc.comments.update.useMutation({
        onSuccess: () => {
            if (!commentEditor) return;
            commentEditor?.setIsCommenting(false);
            dispatchEditorState({ type: "TOGGLE_IS_SUBMITTING" });
            commentEditor.commentForm.reset();
            trpcContext.comments.list.invalidate({
                postId,
            });
        },
    });

    async function submitComment(data: CommentFormData) {
        dispatchEditorState({ type: "TOGGLE_IS_SUBMITTING" });

        if (commentEditor?.isUpdating) {
            if (!commentEditor.commentIdToUpdate) return;
            await updateComment({
                id: commentEditor.commentIdToUpdate,
                content: data.content,
            });
            return;
        }

        if (!commentEditor) return;

        await createComment({
            postId,
            parentId: commentEditor?.parentId,
            content: data.content,
        });
    }

    const { mutateAsync: createPost } = trpc.posts.create.useMutation();

    async function submitPost(data: PostFormData) {
        !editorState.isSubmitting &&
            dispatchEditorState({ type: "TOGGLE_IS_SUBMITTING" });
        await createPost({
            content: data.content,
            title: data.title,
            source: data.source,
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
                    commandController.executeCommand("codeBlock");
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

    return {
        commentForm: commentEditor?.commentForm,
        postForm: postEditor?.postForm,
        MDERef,
        editorState,
        handleShortcuts,
        submitComment,
        submitPost,
        dispatchEditorState,
    };
}

export type UseEditor = ReturnType<typeof useEditor>;
