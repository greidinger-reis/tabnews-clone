import type { Comment, CommentWithChildren } from "./types";

/**
 * takes the raw comment data and formats it into a tree structure
 */
export function formatComments(rawComments: Comment[]): CommentWithChildren[] {
    const map = new Map();

    const roots: CommentWithChildren[] = [];

    // this is a map of comment id to comment with children
    for (let i = 0; i < rawComments.length; i++) {
        const commentId = rawComments[i]?.id;

        map.set(commentId, i);

        (rawComments[i] as CommentWithChildren).children = [];

        if (rawComments[i]?.parentId) {
            const parentId = rawComments[i]?.parentId;
            const parentIndex = map.get(parentId);

            (rawComments[parentIndex] as CommentWithChildren).children.push(
                rawComments[i] as CommentWithChildren
            );

            continue;
        }

        roots.push(rawComments[i] as CommentWithChildren);
    }

    return roots;
}
