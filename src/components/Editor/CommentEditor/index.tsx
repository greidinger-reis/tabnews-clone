import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { type Dispatch, type SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { Editor } from "..";
import { useEditor } from "../hooks/useEditor";

export type CommentFormData = {
    content: string;
};

export function CommentEditor(props: {
    postId: string;
    parentId?: string;
    replyingToPost?: boolean;
    isReplying: boolean;
    setIsReplying: Dispatch<SetStateAction<boolean>>;
    isUpdating?: boolean;
    content?: string;
    commentId?: string;
}) {
    const { replyingToPost, isReplying, setIsReplying, content, isUpdating } =
        props;
    const [autoAnimate] = useAutoAnimate<HTMLDivElement>();
    const commentForm = useForm<CommentFormData>();
    const session = useSession();
    const router = useRouter();

    const editor = useEditor({ commentEditor: { ...props, commentForm } });

    return (
        <div ref={autoAnimate}>
            {props.isReplying ? (
                <Editor
                    editor={{
                        ...editor,
                        isReplying,
                        replyingToPost,
                        setIsReplying,
                        content,
                        isUpdating,
                    }}
                />
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
