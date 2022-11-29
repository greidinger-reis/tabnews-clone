import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark } from "react-syntax-highlighter/dist/esm/styles/prism";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const PreBlock = ({ children, ...rest }: { children: any }) => {
    if ("type" in children && children["type"] === "code") {
        return Code(children["props"]);
    }
    return <pre {...rest}>{children}</pre>;
};

const Code = ({
    className,
    children,
}: {
    className: string;
    children: string;
}) => {
    let lang = "text"; // default monospaced text
    if (className && className.startsWith("lang-")) {
        lang = className.replace("lang-", "");
    }
    return (
        <SyntaxHighlighter language={lang} style={materialDark}>
            {children}
        </SyntaxHighlighter>
    );
};

export default PreBlock;
