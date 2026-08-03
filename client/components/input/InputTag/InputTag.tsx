import clsx from "clsx";
import { XIcon } from "lucide-react";

interface InputTagProps {
    tag: string;
    onDelete: () => void;
}

export default function InputTag(props: InputTagProps) {
    return (
        <span 
            className={clsx(
                "px-2 py-0.5 flex items-center gap-x-1",
                "text-xs text-neutral-300 tracking-wide font-medium",
                "rounded-md bg-blue-600 border border-blue-500",
                "cursor-pointer"
            )}
        >
            {props.tag}
            <XIcon
                onClick={props.onDelete}
                size={10}
                strokeWidth={2.5}
                className="text-neutral-100 hover:text-red-500"
            />
        </span>
    )
}