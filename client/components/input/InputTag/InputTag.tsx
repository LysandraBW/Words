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
                "text-xs text-neutral-500 tracking-wide font-medium",
                "rounded-md bg-neutral-900",
                "cursor-pointer hover:bg-neutral-900"
            )}
        >
            {props.tag}
            <XIcon
                onClick={props.onDelete}
                size={10}
                strokeWidth={2.5}
                className="hover:text-red-500"
            />
        </span>
    )
}