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
                "w-full h-full p-2 grid grid-cols-[auto_1fr] gap-x-2 bg-neutral-900 border border-neutral-800 rounded-2xl shadow",
                "hover:scale-97 transition-all",
                props.answered && "!cursor-default"
            )}
        >
            <div 
                className={clsx(
                    "w-3 h-3 flex justify-center items-center bg-neutral-800 border border-neutral-700 rounded-full shadow",
                    (props.answered && props.flag === true) && "!bg-blue-500 !border-blue-500",
                    (props.answered && props.flag === false) && "!bg-red-500 !border-red-500",
                )}
            >
                {(props.answered && props.flag === true) &&
                    <CheckIcon
                        size={8}
                        strokeWidth={4}
                        className="stroke-neutral-200"
                    />
                }
                {(props.answered && props.flag === false) &&
                    <XIcon
                        size={8}
                        strokeWidth={4}
                        className="relative top-[-0.5px] left-[0.0px] stroke-neutral-200"
                    />
                }
            </div>
            <div className="w-full h-full pr-2.5 flex items-center justify-center">
                <span className="text-sm text-neutral-500 text-center tracking-wide whitespace-nowrap">
                    {props.content}
                </span>
            </div>
        </button>
    )
}