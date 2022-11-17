import { Transition } from "@headlessui/react";
import { Fragment, useState } from "react";

export function Tooltip({
    message,
    children,
}: {
    message: string;
    children: React.ReactNode;
}) {
    const [open, setOpen] = useState(false);
    return (
        <div
            className="group relative flex flex-col items-center overflow-visible"
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
        >
            {children}
            <Transition
                as={Fragment}
                show={open}
                enter="transition-opacity duration-500"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity duration-500"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
            >
                <div className="absolute bottom-4 mb-2 hidden flex-col items-center group-hover:flex">
                    <span className="whitespace-no-wrap relative z-10 w-max rounded-md bg-zinc-800 p-2 text-xs leading-none text-white shadow-md">
                        {message}
                    </span>
                    <span className="triangle" />
                </div>
            </Transition>
        </div>
    );
}
