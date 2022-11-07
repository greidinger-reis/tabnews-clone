import { createContext } from "react";
import { type CommandController } from "react-mde";

interface ICommentFormContext {
    commandController: CommandController<string>;
}

export const CommentFormContext = createContext<ICommentFormContext>(
    {} as ICommentFormContext
);