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
                "w-full h-full p-2 grid grid-cols-[auto_1fr] gap-x-2 bg-neutral-800 rounded-2xl overflow-clip",
                "hover:scale-97 transition-all",
                props.answered && "!cursor-default"
            )}
        >
            <div 
                className={clsx(
                    "w-4 h-4 flex justify-center items-center bg-neutral-700 rounded-full",
                    (props.answered && props.flag === true) && "!bg-blue-500",
                    (props.answered && props.flag === false) && "!bg-red-500",
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