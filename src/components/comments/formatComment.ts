import type { Comment, CommentWithChildren } from "./types";

function setMapAndInitChildren(comments: Comment[]) {
    const map = new Map<string, number>();

    for (let i = 0; i < comments.length; i++) {
        const commentId = comments[i]?.id as string;
        (comments[i] as CommentWithChildren).children = [];
        map.set(commentId, i);
    }

    return map;
}

function formatComments(comments: Comment[]): CommentWithChildren[] {
    const initTime = Date.now();
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

    console.log(`formatComments took ${Date.now() - initTime}ms`);
    return sortedRoots;
}

export default formatComments;
