import type { Comment, CommentWithChildren } from "~/types/trpc";

function setMapAndInitChildren(comments: Comment[]) {
    const map = new Map<string, number>();

    comments.forEach((comment, index) => {
        const commentId = comment.id;
        (comment as CommentWithChildren).children = [];
        map.set(commentId, index);
    });

    return map;
}

export function formatComments(comments: Comment[]): CommentWithChildren[] {
    const roots: CommentWithChildren[] = [];
    const map = setMapAndInitChildren(comments);

    map.forEach((index) => {
        // if there's no parent, it's a root comment
        if (!comments[index]?.parentId) {
            roots.push(comments[index] as CommentWithChildren);
            return;
        }

        // if there's a parent, get the parent's index
        const parentIndex = map.get(comments[index]?.parentId as string);
        if (!parentIndex) return;

        // add the comment to the parent's children object
        (comments[parentIndex] as CommentWithChildren).children.push(
            comments[index] as CommentWithChildren
        );

        // sort the children by date
        (comments[parentIndex] as CommentWithChildren).children.sort(
            (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
        );
    });

    // sort the roots by likes
    const sortedRoots = roots.sort((a, b) => b.likes.length - a.likes.length);

    return sortedRoots;
}
