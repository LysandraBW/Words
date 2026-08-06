import { PlusIcon } from "lucide-react";
import Inflection from "./Inflections";
import Level from "./Level";
import { ScribbleTag } from "./ShowEntry";
import { Entry } from "@/services/words/getWordEntry";
import clsx from "clsx";


interface ShowEntryShortProps {
    entry: Entry;
    entryNum: number;
    numEntries: number;
    onOpenWord: (word: string) => void;
    allowLog: boolean;
    onLog: (def: string) => void;
}


export default function ShowEntryShort(props: ShowEntryShortProps) {
    return (
        <div className="grid grid-cols-[auto_1fr]">
            <Level
                level={-1}
                label={""}
                long={true}
            />
            <div
                className="w-full flex flex-col gap-y-1"
            >
                <div className="flex items-center gap-x-2"> 
                    <h6 className="text-xl text-neutral-100 font-medium capitalize uppercase">
                        {props.entry.meta.id.split(":")[0]}
                    </h6>
                    <ScribbleTag
                        text={`${props.entryNum}/${props.numEntries}`}
                        className="text-blue-500"
                    />
                    {props.entry.fl &&
                        <ScribbleTag
                            text={props.entry.fl}
                            className="text-blue-500"
                        />
                    }
                </div>
                {props.entry.ins &&
                    <Inflection
                        ins={props.entry.ins}
                    />
                }
                <div className="flex flex-col gap-y-3">
                    {props.entry.shortdef?.map((def: string, j: number) => (
                        <div 
                            key={j}
                            className={clsx(
                                props.allowLog && "grid grid-cols-[1fr_18px] gap-x-6"
                            )}    
                        >
                            <div className="flex">
                                <div className="w-6 min-w-6 flex flex-col items-center">
                                    <span className="text-white font-medium">{j + 1}</span>
                                </div>
                                <p className="text-base text-neutral-100 tracking-wide">
                                    : {def}
                                </p>
                            </div>
                            {props.allowLog &&
                                <button 
                                    onClick={() => props.onLog(def)}
                                    className="aspect-square h-min flex justify-center items-center bg-blue-600 border border-blue-500 rounded-md shadow-sm"    
                                >
                                    <PlusIcon
                                        size={10}
                                        className="stroke-neutral-100 scale-x-95"
                                    />
                                </button>
                            }
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}