import clsx from "clsx";
import { LucideIcon } from "lucide-react";

interface CreateTypeTabProps {
    selected: boolean;
    label: string;
    Icon: LucideIcon;
    onClick: () => void;
    outerClassName?: string;
}


export default function CreateTypeTab(props: CreateTypeTabProps) {
    return (
        <button 
            onClick={props.onClick}
            className={clsx(
                "p-1 w-full flex justify-center items-center gap-x-2 border border-neutral-800",
                props.selected && "bg-blue-600 !border-blue-500",
                props.outerClassName
            )}
        >
            <props.Icon
                size={16}
                className={clsx(
                    "text-neutral-500",
                    props.selected && "!text-neutral-200"
                )}
            />
            <span 
                className={clsx(
                    "text-sm text-neutral-400 font-medium",
                    props.selected && "!text-neutral-100"
                )}
            >
                {props.label}
            </span>
        </button>
    )
}