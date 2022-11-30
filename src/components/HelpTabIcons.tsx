import {
    RiDoubleQuotesL,
    RiListOrdered,
    RiListUnordered,
} from "react-icons/ri";
import {
    BracketsCurly,
    CheckSquare,
    Code,
    Image,
    Link,
    TextBolder,
    TextHOne,
    TextHThree,
    TextHTwo,
    TextItalic,
    TextStrikethrough,
} from "phosphor-react";

interface IHelpTabItems {
    title: string;
    auxText: string;
    icon: React.ReactNode;
}

export const helpTabItems: IHelpTabItems[] = [
    {
        title: "Cabeçalho 1",
        auxText: "# cabeçalho",
        icon: <TextHOne size={18} />,
    },
    {
        title: "Cabeçalho 2",
        auxText: "## cabeçalho",
        icon: <TextHTwo size={18} />,
    },
    {
        title: "Cabeçalho 3",
        auxText: "### cabeçalho",
        icon: <TextHThree size={18} />,
    },
    {
        title: "Negrito",
        auxText: "**texto em negrito**",
        icon: <TextBolder size={18} />,
    },
    {
        title: "Itálico",
        auxText: "*texto em italico*",
        icon: <TextItalic size={18} />,
    },
    {
        title: "Citar",
        auxText: "> texto citado",
        icon: <RiDoubleQuotesL size={18} />,
    },
    {
        title: "Link",
        auxText: "[texto do link](url)",
        icon: <Link size={18} />,
    },
    {
        title: "Imagem",
        auxText: '![texto](url "titulo")',
        icon: <Image size={18} alt="" />,
    },
    {
        title: "Código",
        auxText: "`código`",
        icon: <Code size={18} />,
    },
    {
        title: "Bloco de código",
        auxText: "```código```",
        icon: <BracketsCurly size={18} />,
    },
    {
        title: "Lista não ordenada",
        auxText: "- item",
        icon: <RiListUnordered size={18} />,
    },
    {
        title: "Lista ordenada",
        auxText: "1. item",
        icon: <RiListOrdered size={18} />,
    },
    {
        title: "Linha horizontal",
        auxText: "---",
        icon: <HorizontalLine />,
    },
    {
        title: "Riscado",
        auxText: "~~texto riscado~~",
        icon: <TextStrikethrough size={18} />,
    },
    {
        title: "Tarefa",
        auxText: "- [ ] tarefa",
        icon: <CheckSquare size={18} />,
    },
];

export const helpTabShortcuts: IHelpTabItems[] = [
    {
        title: "Negrito",
        auxText: "Ctrl-B",
        icon: <TextBolder size={18} />,
    },
    {
        title: "Itálico",
        auxText: "Ctrl-I",
        icon: <TextItalic size={18} />,
    },
    {
        title: "Link",
        auxText: "Ctrl-K",
        icon: <Link size={18} />,
    },
    {
        title: "Código",
        auxText: "Shift-Ctrl-K",
        icon: <Code size={18} />,
    },
    {
        title: "Bloco de código",
        auxText: "Shift-Ctrl-C",
        icon: <BracketsCurly size={18} />,
    },
    {
        title: "Lista não ordenada",
        auxText: "Shift-Ctrl-U",
        icon: <RiListUnordered size={18} />,
    },
    {
        title: "Lista ordenada",
        auxText: "Shift-Ctrl-O",
        icon: <RiListOrdered size={18} />,
    },
];

function HorizontalLine() {
    return (
        <svg
            width="1em"
            height="1em"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M5 24H43"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
            ></path>
            <path
                d="M21 38H27"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
            ></path>
            <path
                d="M37 38H43"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
            ></path>
            <path
                d="M21 10H27"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
            ></path>
            <path
                d="M5 38H11"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
            ></path>
            <path
                d="M5 10H11"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
            ></path>
            <path
                d="M37 10H43"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
            ></path>
        </svg>
    );
}

export function HelpTabItem({ title, auxText, icon }: IHelpTabItems) {
    return (
        <li className="flex w-56 items-center justify-between text-zinc-400">
            <div className="flex gap-2">
                {icon}
                <span className="text-[13px]">{title}</span>
            </div>
            <span className="mono text-xs">{auxText}</span>
        </li>
    );
}
