import clsx from "clsx";
import { LucideIcon } from "lucide-react";


interface IconButtonProps {
    Icon: LucideIcon;
    onClick: () => void;
    className?: string;
}


export default function IconButton(props: IconButtonProps) {
    return (
        <button 
            onClick={props.onClick}
            className={clsx(
                "p-1 w-[26px] min-w-[26px] h-[26px] min-h-[26px] flex justify-center items-center bg-neutral-800 border border-neutral-700 rounded-md shadow-sm",
                props.className
            )}
        >
            <props.Icon
                size={14}
                strokeWidth={2}
                className="stroke-neutral-500"
            />
        </button>
    )
}