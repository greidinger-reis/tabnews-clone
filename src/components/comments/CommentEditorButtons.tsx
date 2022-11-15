import {
    BsCode,
    BsCodeSlash,
    BsLink45Deg,
    BsListCheck,
    BsListOl,
    BsListUl,
    BsTypeBold,
    BsTypeH2,
    BsTypeH3,
    BsTypeItalic,
    BsTypeStrikethrough,
} from "react-icons/bs";
import {GrBlockQuote} from "react-icons/gr";
import {type ReactNode, useContext} from "react";
import {CommentFormContext} from "./context";

const CommentFormButton = ({
                               children,
                               command,
                               isBlockCodeCommand,
                           }: {
    children: ReactNode;
    command: string;
    isBlockCodeCommand?: boolean;
}) => {
    const {commandController} = useContext(CommentFormContext);

    return (
        <button
            className="rounded p-2 transition-all hover:bg-blue-700 hover:bg-opacity-25 hover:text-zinc-500 dark:text-white"
            onClick={async () => {
                if (!isBlockCodeCommand) {
                    await commandController.executeCommand(command);
                    return;
                }
                await commandController.executeCommand(command);
                await commandController.executeCommand(command);
                await commandController.executeCommand(command);
            }}
        >
            {children}
        </button>
    );
};

const CommentFormButtons = () => {
    return (
        <div
            className="flex gap-1 overflow-x-scroll rounded-t border border-b-0 border-zinc-400 bg-white p-1 group-focus-within:border-blue-500 dark:border-zinc-700 dark:bg-zinc-800 sm:overflow-x-auto">
            <CommentFormButton command="h2">
                <BsTypeH2 size={24}/>
            </CommentFormButton>
            <CommentFormButton command="h3">
                <BsTypeH3 size={24}/>
            </CommentFormButton>
            <CommentFormButton command="bold">
                <BsTypeBold size={24}/>
            </CommentFormButton>
            <CommentFormButton command="italic">
                <BsTypeItalic size={24}/>
            </CommentFormButton>
            <CommentFormButton command="strikethrough">
                <BsTypeStrikethrough size={24}/>
            </CommentFormButton>
            <CommentFormButton command="link">
                <BsLink45Deg size={24}/>
            </CommentFormButton>
            <CommentFormButton command="quote">
                <GrBlockQuote size={24}/>
            </CommentFormButton>
            <CommentFormButton command="orderedList">
                <BsListOl size={24}/>
            </CommentFormButton>
            <CommentFormButton command="unorderedList">
                <BsListUl size={24}/>
            </CommentFormButton>
            <CommentFormButton command="checkedList">
                <BsListCheck size={24}/>
            </CommentFormButton>
            <CommentFormButton command="code">
                <BsCode size={24}/>
            </CommentFormButton>
            <CommentFormButton command="codeBlock" isBlockCodeCommand={true}>
                <BsCodeSlash size={24}/>
            </CommentFormButton>
        </div>
    );
};

export default CommentFormButtons;
