import clsx from "clsx";
import { LucideIcon } from "lucide-react"

interface NavBarTabProps {
    TabIcon: LucideIcon;
    tabLabel: string;
    selected: boolean;
    onClick: (tabLabel: string) => void;
    collapse?: boolean;
}


export default function NavBarTab(props: NavBarTabProps) {
    return (
        <button 
            onClick={() => props.onClick(props.tabLabel)}
            className={clsx(
                "w-full px-2 py-1 flex items-center gap-x-2 rounded-md",
                !props.selected && "bg-neutral-950/50 border border-transparent hover:bg-neutral-950/75 stroke-neutral-500 text-neutral-500 hover:scale-97 transition-all",
                props.selected && "bg-neutral-800 border border-neutral-700 shadow-sm stroke-neutral-400 text-neutral-200",
                props.collapse && "!w-min "
            )}
        >
            <props.TabIcon
                size={14}
                strokeWidth={1.5}
                className="stroke-inherit"
            />
            {!props.collapse &&
                <span className="text-inherit text-sm font-medium">
                    {props.tabLabel}
                </span>
            }
        </button>
    )
}