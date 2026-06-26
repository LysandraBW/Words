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
                "relative w-full h-full p-2 grid grid-cols-[auto_1fr] gap-x-2 justify-center bg-neutral-200 rounded-xl [&:nth-child(3)]:rounded-bl-2xl overflow-clip",
                "hover:scale-97 transition-all",
                props.answered && "!cursor-default"
            )}
        >
            <div 
                className={clsx(
                    "w-4 h-4 flex justify-center items-center bg-neutral-300 rounded-full",
                    (props.answered && props.flag === true) && "!bg-blue-500",
                    (props.answered && props.flag === false) && "!bg-red-600",
                )}
            >
                {(props.answered && props.flag === true) &&
                    <CheckIcon
                        size={8}
                        strokeWidth={5}
                        className="stroke-neutral-100"
                    />
                }
                {(props.answered && props.flag === false) &&
                    <XIcon
                        size={8}
                        strokeWidth={5}
                        className="stroke-neutral-100"
                    />
                }
            </div>
            <span className="pr-2 self-center text-base text-neutral-500/75 text-center font-medium tracking-wide">
                {props.content}
            </span>
        </button>
    )
}