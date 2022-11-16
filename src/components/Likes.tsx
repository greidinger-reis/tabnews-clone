import classNames from "classnames";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";

export function Likes({
    likesCount,
    handleAddLike,
    handleRemoveLike,
    userHasLiked,
}: {
    likesCount: number;
    handleRemoveLike: () => void;
    handleAddLike: () => void;
    userHasLiked: boolean;
}) {
    return (
        <aside className="flex flex-col items-center pr-2">
            <div className="flex flex-col items-center gap-1">
                <button
                    className={classNames(
                        "rounded-lg p-2 hover:bg-[#ddf4ff]/50",
                        {
                            "bg-[#ddf4ff]/50 text-blue-500": userHasLiked,
                        }
                    )}
                    onClick={handleAddLike}
                >
                    <BsChevronUp className="text-sm" />
                </button>
                <span className="text-[12px] font-medium text-blue-500">
                    {likesCount}
                </span>
                <button
                    className="rounded-lg p-2 hover:bg-[#ddf4ff]/50"
                    onClick={handleRemoveLike}
                >
                    <BsChevronDown className="text-sm" />
                </button>
            </div>
            <div className="h-full border-l border-dotted"></div>
        </aside>
    );
}
