import clsx from "clsx";
import { LucideIcon } from "lucide-react"

interface TabProps {
    TabIcon: LucideIcon;
    tabLabel: string;
    selected: boolean;
    onClick: (tabLabel: string) => void;
}


export default function Tab(props: TabProps) {
    return (
        <div 
            onClick={() => props.onClick(props.tabLabel)}
            className={clsx(
                "py-1 px-2 flex justify-center items-center gap-x-2 border border-transparent rounded-md text-sm text-neutral-500 font-medium",
                !props.selected && "bg-neutral-950/50 cursor-pointer hover:bg-neutral-950/75 hover:scale-97 transition-all",
                props.selected && "bg-blue-600 !border-blue-500 shadow-sm !text-neutral-200"
            )}
        >
            <props.TabIcon
                size={14}
                strokeWidth={1.5}
            />
            {props.tabLabel}
        </div>
    )
}