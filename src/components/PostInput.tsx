import { forwardRef, type HTMLProps } from "react";

export const PostInput = forwardRef<
    HTMLInputElement,
    HTMLProps<HTMLInputElement>
>(function PostInput(props: HTMLProps<HTMLInputElement>, ref) {
    return (
        <input
            className="w-full rounded-md border border-zinc-300 py-2 px-4 text-sm focus:outline-blue-500"
            {...props}
            ref={ref}
        />
    );
});
