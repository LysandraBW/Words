import clsx from "clsx";
import { LucideIcon, MinusIcon, TrendingDownIcon, TrendingUpIcon } from "lucide-react";

interface CardProps {
    Icon: LucideIcon;
    cardKey: string;
    cardKeyContext: string;
    cardValue: string;
    cardValueChange: number;
}

export default function Card(props: CardProps) {
    return (
        <div
            className="w-full h-[156px] p-4 flex flex-col justify-between bg-neutral-900 border border-neutral-800 rounded-lg shadow-md"
        >
            <div className="flex justify-between items-center">
                <span className="text-neutral-300">
                    {props.cardKey}
                </span>
                <props.Icon
                    size={16}
                    className="stroke-blue-500"
                />
            </div>
            <div>
                <div className="flex gap-x-2 items-center">
                    <span className="text-3xl text-neutral-100 font-medium">
                        {props.cardValue}
                    </span>
                    <span 
                        className={clsx(
                            "px-2 py-0.5 flex gap-x-1.5 items-center rounded-full",
                            props.cardValueChange > 50 && "bg-green-600/10",
                            props.cardValueChange < 50 && "bg-red-600/10",
                            props.cardValueChange === 50 && "bg-yellow-600/10"
                        )}
                    >
                        {props.cardValueChange > 50 &&
                            <TrendingUpIcon
                                size={10}
                                className="fill-green-600 stroke-green-700"
                            />
                        }
                        {props.cardValueChange < 50 &&
                            <TrendingDownIcon
                                size={10}
                                className="fill-red-600 stroke-red-700"
                            />
                        }
                        {props.cardValueChange === 50 &&
                            <MinusIcon
                                size={10}
                                className="stroke-yellow-600"
                            />
                        }
                        <span 
                            className={clsx(
                                "text-xs",
                                props.cardValueChange > 50 && "text-green-600",
                                props.cardValueChange < 50 && "text-red-600",
                                props.cardValueChange === 50 && "text-yellow-600"
                            )}
                        >
                            50%
                        </span>
                    </span>
                </div>
                <span className="text-sm text-neutral-500">
                    {props.cardKeyContext}
                </span>
            </div>
        </div>
    )
}