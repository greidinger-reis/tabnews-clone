import type { Outputs } from "~/types/trpc";

type CommentListOutput = Outputs["comments"]["list"];

export type Comment = CommentListOutput[number];

export type CommentWithChildren = Comment & {
    children: CommentWithChildren[];
};
