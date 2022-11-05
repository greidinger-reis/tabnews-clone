import React from "react";

export function useIsIntersecting<TElement extends HTMLElement>() {
    // to prevents runtime crash in IE, let's mark it true right away
    const [isIntersecting, setIsIntersecting] = React.useState(false);

    const ref = React.useRef<TElement>(null);

    React.useEffect(() => {
        if (!ref.current) {
            return;
        }
        const observer = new IntersectionObserver(([entry]) => {
            if (!entry) return;
            setIsIntersecting(entry.isIntersecting);
        });
        observer.observe(ref.current);
        return () => {
            observer.disconnect();
        };
    }, []);
    return [isIntersecting, ref] as const;
}
