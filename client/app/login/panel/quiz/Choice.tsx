import clsx from "clsx";

interface ChoiceProps {
    onClick: () => void;
    content: string;
    flag: boolean | null;
    selected: boolean;
}


export default function Choice(props: ChoiceProps) {
    return (
        <button 
            onClick={props.onClick}
            className={clsx(
                "relative w-full h-full p-2 flex justify-center items-center rounded-xl shadow-md",
                props.flag === null && "bg-neutral-800 border border-neutral-700/50 hover:scale-97 hover:bg-neutral-800/90 transition-all",
                props.flag === true && "!cursor-default bg-green-500/10 border border-green-500/40 ring-4 ring-green-500/10",
                props.flag === false && "!cursor-default bg-red-500/10 border border-red-500/40 ring-4 ring-red-500/10"
            )}
        >
            <div className={clsx(
                "absolute top-2 left-2 w-4 h-4 flex justify-center items-center rounded-full",
                "bg-neutral-900 border border-neutral-700/50",
                (!props.selected && props.flag === true) && "!border-green-500/30",
                (!props.selected && props.flag === false) && "!border-red-500/30",
                props.selected && "!bg-blue-500 !border-blue-400",
            )}>
                {props.selected &&
                    <div className="w-2 h-2 bg-neutral-100 rounded-full">

                    </div>
                }
            </div>
            <span className="text-sm text-neutral-500 text-center tracking-wide">
                {props.content}
            </span>
        </button>
    )
}