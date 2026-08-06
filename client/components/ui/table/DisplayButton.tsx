import clsx from "clsx";
import { LayoutGridIcon, LayoutListIcon } from "lucide-react";

export interface DisplayButtonProps {
    display: string;
    onClickDisplay: (option: string) => void;
}

export default function DisplayButton(props: DisplayButtonProps) {
    return (
        <div className="w-min flex bg-neutral-800 rounded-md">
            {["List", "Grid"].map((option: string, i: number) => (
                <button 
                    key={i}
                    onClick={() => {
                        if (props.onClickDisplay)
                            props.onClickDisplay(option as any);
                    }}
                    className={clsx(
                        "p-1 w-[26px] h-[26px] flex justify-center items-center border border-neutral-700 first:rounded-l-md last:rounded-r-md shadow-sm",
                        option === props.display && "!bg-blue-600 !border-blue-500"
                    )}
                >
                    {option === "List" ?
                        <LayoutListIcon
                            size={14}
                            strokeWidth={1.5}
                            className={clsx(
                                option === props.display ? "stroke-neutral-300" : "stroke-neutral-500"
                            )}
                        />
                        :
                        <LayoutGridIcon
                            size={14}
                            strokeWidth={1.5}
                            className={clsx(
                                option === props.display ? "stroke-neutral-300" : "stroke-neutral-500"
                            )}
                        />
                    }
                </button>
            ))}
        </div>
    )
}