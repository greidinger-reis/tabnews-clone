import { useState } from "react";
import type { CommentWithChildren } from "./types";
import { CommentForm } from "./CommentForm";
import classNames from "classnames";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { format, formatDistance } from "date-fns";
import { trpc } from "~/utils/trpc";
import { useSession } from "next-auth/react";
import Markdown from "markdown-to-jsx";
import {
    BsChatLeftDots,
    BsChevronDown,
    BsChevronUp,
    BsTrash,
} from "react-icons/bs";
import { AiOutlineHeart } from "react-icons/ai";
import { useAtom } from "jotai";
import { PostIdAtom } from "~/pages/[userName]/[slug]";
import Link from "next/link";
import { ptBR } from "date-fns/locale";
import { Likes } from "../Likes";

// function CommentActions({
//     commentId,
//     authorId,
// }: {
//     commentId: string;
//     authorId: string;
// }) {
//     const [postId] = useAtom(PostIdAtom);
//     const { data: session } = useSession();
//     const ctx = trpc.useContext();
//     const [autoAnimate] = useAutoAnimate<HTMLDivElement>();
//     const [isReplying, setIsReplying] = useState(false);

//     const { data: likes, refetch: refetchLikes } =
//         trpc.likes.listFromComment.useQuery({
//             commentId,
//         });

//     const { mutate: likeComment } = trpc.likes.addToComment.useMutation({
//         onSuccess: () => {
//             refetchLikes();
//         },
//     });

//     const { mutate: unlikeComment } = trpc.likes.removeFromComment.useMutation({
//         onSuccess: () => {
//             refetchLikes();
//         },
//     });

//     const { mutate: deleteComment } = trpc.comments.delete.useMutation({
//         onSuccess: () => {
//             ctx.comments.list.invalidate();
//         },
//     });

//     const isOwner = session?.user?.id === authorId;
//     const isLiked = likes?.find((like) => like.userId === session?.user?.id);

//     return (
//         <div ref={autoAnimate} className="mt-2 flex flex-col">
//             <div className="mb-2 flex items-center gap-1 text-sm">
//                 <button
//                     className="btn-gray font-medium"
//                     onClick={() => setIsReplying(!isReplying)}
//                 >
//                     Responder
//                 </button>
//                 <button
//                     className={classNames(
//                         "gap-1 hover:bg-zinc-200 hover:bg-opacity-70 dark:text-gray-500",
//                         {
//                             "text-red-500 hover:bg-red-200": isLiked,
//                         }
//                     )}
//                     onClick={() => {
//                         isLiked
//                             ? unlikeComment({ commentId })
//                             : likeComment({ commentId });
//                     }}
//                 >
//                     <AiOutlineHeart size={16} />
//                 </button>
//                 {likes?.length} {likes?.length === 1 ? "Like" : "Likes"}
//                 {isOwner && (
//                     <button
//                         className="gap-1 hover:bg-zinc-200 hover:bg-opacity-70 dark:text-gray-500"
//                         onClick={() => deleteComment({ commentId })}
//                     >
//                         <BsTrash size={16} />
//                         Delete
//                     </button>
//                 )}
//             </div>
//             {isReplying && (
//                 <div className="mb-4">
//                     <CommentForm
//                         postId={postId}
//                         setIsReplying={setIsReplying}
//                         parentId={commentId}
//                     />
//                 </div>
//             )}
//         </div>
//     );
// }

function Comment({
    id,
    parentId,
    content,
    createdAt,
    author,
    children,
    _count,
}: CommentWithChildren) {
    const session = useSession();
    const [autoAnimate] = useAutoAnimate<HTMLLIElement>();
    const [isReplying, setIsReplying] = useState(false);

    const { data: likes, refetch: refetchLikes } =
        trpc.likes.listFromComment.useQuery({
            commentId: id,
        });

    const { mutate: likeComment } = trpc.likes.addToComment.useMutation({
        onSuccess: () => {
            refetchLikes();
        },
    });

    const { mutate: unlikeComment } = trpc.likes.removeFromComment.useMutation({
        onSuccess: () => {
            refetchLikes();
        },
    });

    const isOwner = session?.data?.user?.id === author.id;
    const userHasLiked =
        likes?.some((like) => like.userId === session?.data?.user?.id) ?? false;

    // const PreBlock = dynamic(() => import("../Code"), { ssr: false });
    return (
        <div className="flex">
            <Likes
                handleAddLike={async () => {
                    likeComment(id);
                }}
                handleRemoveLike={async () => {
                    unlikeComment(id);
                }}
                likesCount={likes?.length ?? 0}
                userHasLiked={userHasLiked}
            />
            <li ref={autoAnimate} className="flex flex-1 flex-col gap-2">
                <p>
                    <Link
                        href={`/${author.username}`}
                        className="rounded-md bg-[#ddf4ff] px-2 py-1 font-mono text-xs text-blue-500"
                    >
                        {author.username}
                    </Link>{" "}
                    <span className="text-xs text-zinc-600">
                        {formatDistance(new Date(createdAt), new Date(), {
                            locale: ptBR,
                        })}
                    </span>
                </p>

                <div className="prose prose-code:rounded-lg prose-code:bg-gray-200 prose-code:py-1 prose-code:px-2 prose-code:before:content-none prose-code:after:content-none dark:prose-invert">
                    <Markdown
                        options={{
                            disableParsingRawHTML: true,
                            // overrides: {
                            //     pre: PreBlock,
                            // },
                        }}
                    >
                        {content}
                    </Markdown>
                </div>
                <button
                    className="btn-gray w-fit text-xs font-medium"
                    onClick={() => setIsReplying(!isReplying)}
                >
                    Responder
                </button>
                {isReplying && (
                    <div className="mb-4">
                        <CommentForm
                            postId={id}
                            setIsReplying={setIsReplying}
                            parentId={parentId ?? undefined}
                        />
                    </div>
                )}
                {children && children.length > 0 && (
                    <CommentList comments={children} />
                )}
            </li>
        </div>
    );
}

export function CommentList({ comments }: { comments: CommentWithChildren[] }) {
    const [autoAnimate] = useAutoAnimate<HTMLUListElement>();
    return (
        <ul className="flex flex-col gap-4" ref={autoAnimate}>
            {comments?.map((comment) => (
                <Comment key={comment.id} {...comment} />
            ))}
        </ul>
    );
}
