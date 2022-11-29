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

type CommentEditorStateActionsProps = {
    isCommenting: boolean;
    setIsCommenting: Dispatch<SetStateAction<boolean>>;
};

type CommentEditorProps = {
    isRootComment?: boolean;
    parentId?: string;
    contentToUpdate?: string;
    commentIdToUpdate?: string;
} & CommentEditorStateActionsProps;

export function CommentEditor({
    isCommenting,
    setIsCommenting,
    parentId,
    isRootComment,
    commentIdToUpdate,
    contentToUpdate,
}: CommentEditorProps) {
    const [autoAnimate] = useAutoAnimate<HTMLDivElement>();
    const commentForm = useForm<CommentFormData>();

    const editor = useEditor({
        commentEditor: {
            commentForm,
            setIsCommenting,
            parentId,
            commentIdToUpdate,
            isUpdating: Boolean(commentIdToUpdate),
        },
    });

    return (
        <div ref={autoAnimate}>
            {isCommenting ? (
                <Editor
                    editor={{
                        ...editor,
                        isRootComment,
                        isCommenting,
                        setIsCommenting,
                        contentToUpdate,
                    }}
                />
            ) : (
                <SetIsCommentingButton
                    isCommenting={isCommenting}
                    setIsCommenting={setIsCommenting}
                    isRootCommentButton={isRootComment}
                />
            )}
        </div>
    );
}

function SetIsCommentingButton(props: {
    isRootCommentButton?: boolean;
    isCommenting: boolean;
    setIsCommenting: Dispatch<SetStateAction<boolean>>;
}) {
    const router = useRouter();
    const session = useSession();
    const { isCommenting, isRootCommentButton, setIsCommenting } = props;

    function handleSetIsCommenting() {
        if (session.status === "unauthenticated") {
            router.push("/login");
            return;
        }
        setIsCommenting(!isCommenting);
    }

    return (
        <button
            className={`btn-gray my-2 w-fit text-sm font-medium ${
                isRootCommentButton && "ml-1 sm:ml-0"
            }`}
            onClick={handleSetIsCommenting}
        >
            Responder
        </button>
    );
}
