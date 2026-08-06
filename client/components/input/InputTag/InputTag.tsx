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
                "px-2 py-1 flex items-center gap-x-2",
                "text-sm text-neutral-100 tracking-wide",
                "rounded-md bg-neutral-900",
                "cursor-pointer"
            )}
        >
            {props.tag}
            <XIcon
                onClick={props.onDelete}
                size={10}
                strokeWidth={2.5}
                className="text-neutral-400 hover:text-red-500"
            />
        </span>
    )
}