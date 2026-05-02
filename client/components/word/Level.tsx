import clsx from "clsx";

interface LevelProps {
    label: string | number;
    level: -1 | 0 | 1;
    long?: boolean;
}

export default function Level(props: LevelProps) {
    return (
        <div className="w-6 min-w-6 flex flex-col items-center">
            <span className="text-white font-medium">
                {props.label}
            </span>
            <div 
                className={clsx(
                    "w-[1px] h-full",
                    "relative",
                    props.level === -1 && "bg-zinc-400",
                    props.level === 0 && "bg-zinc-500",
                    props.level === 1 && "bg-zinc-600",
                )}
            >
                {props.long &&
                    <>
                        <div className="w-2 aspect-square rounded-full bg-transparent border border-blue-500 border-dashed absolute top-[-2px] left-[-3.5px]">
                            <div className="w-1 aspect-square rounded-full bg-white absolute top-[1px] left-[1px]">

                            </div>
                        </div>
                        <div className="w-2 aspect-square rounded-full bg-transparent border border-white border-dashed absolute bottom-[-2px] left-[-3.5px]">
                            <div className="w-1 aspect-square rounded-full bg-blue-500 absolute top-[1px] left-[1px]">

                            </div>
                        </div>
                    </>
                }
            </div>
        </div>
    )
}