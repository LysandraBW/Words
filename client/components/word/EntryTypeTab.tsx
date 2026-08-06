import clsx from "clsx";
import { LucideIcon } from "lucide-react";

interface EntryTypeTabProps {
    selected: boolean;
    label: string;
    Icon: LucideIcon;
    onClick: () => void;
    outerClassName?: string;
}


export default function EntryTypeTab(props: EntryTypeTabProps) {
    return (
        <button 
            onClick={props.onClick}
            className={clsx(
                "p-1 w-full flex justify-center items-center gap-x-2 border-transparent",
                props.selected && "bg-neutral-800",
                props.outerClassName
            )}
        >
            <props.Icon
                size={16}
                className={clsx(
                    "text-neutral-500",
                    props.selected && "!text-neutral-400"
                )}
            />
            <span 
                className={clsx(
                    "text-sm text-neutral-400 font-medium",
                    props.selected && "!text-neutral-300"
                )}
            >
                {props.label}
            </span>
        </button>
    )
}