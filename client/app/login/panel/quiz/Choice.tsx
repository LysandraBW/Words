import clsx from "clsx";
import { CheckIcon, XIcon } from "lucide-react";

interface ChoiceProps {
    onClick: () => void;
    content: string;
    flag: boolean | null;
    selected: boolean;
    answered: boolean;
}


export default function Choice(props: ChoiceProps) {
    return (
        <button 
            onClick={props.onClick}
            className={clsx(
                "relative w-full h-full p-2 grid grid-cols-[auto_1fr] justify-center rounded-xl shadow-md",
                "border border-neutral-800 hover:scale-97 hover:shadow-xs transition-all",
                (props.selected && props.flag === true) && "!cursor-default bg-green-500/1 border !border-green-500/40",
                (props.selected && props.flag === false) && "!cursor-default bg-red-500/1 border !border-red-500/40"
            )}
        >
            <div className={clsx(
                "w-4 h-4 flex justify-center items-center rounded-full",
                "bg-neutral-900 border border-neutral-700/50",
                (props.answered && props.flag === true) && "!bg-green-500 !border-green-500/30",
                (props.answered && props.flag === false) && "!bg-red-500 !border-red-500/30",
            )}>
                {(props.answered && props.flag === true) &&
                    <CheckIcon
                        size={8}
                        strokeWidth={5}
                        className="stroke-green-800"
                    />
                }
                {(props.answered && props.flag === false) &&
                    <XIcon
                        size={8}
                        strokeWidth={5}
                        className="stroke-red-800"
                    />
                }
            </div>
            <span 
                className={clsx(
                    "self-center text-sm text-neutral-500/75 text-center tracking-wide",
                    (props.selected && props.flag === true) && "!text-green-400/75",
                    (props.selected && props.flag === false) && "!text-red-400/75",

                )}
            >
                {props.content}
            </span>
        </button>
    )
}