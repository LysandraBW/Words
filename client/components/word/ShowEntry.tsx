import { Definition, DefinitionData, Entry, SenseSequenceElement } from "@/services/words/getWordEntry";
import Inflection from "./Inflections";
import { scribble } from "@/app/fonts";
import clsx from "clsx";
import Level from "./Level";
import { Fragment } from "react/jsx-runtime";
import Sequence from "./Sequence";
import { createContext } from "react";

interface ShowEntryProps {
    entry: Entry;
    entryNum: number;
    numEntries: number;
    onOpenWord: (word: string) => void;
}


function ScribbleTag(props: {text: string; className: string}) {
    return (
        <span
            className={clsx(
                "block px-2 py-0.5",
                "text-xs font-semibold tracking-wide bg-neutral-800 border border-neutral-700 shadow-md text-blue-500",
                props.className, "rounded-md"
            )}
        >
            {props.text}
        </span>
    )
}


export const EntryHandlerContext = createContext<{onOpenWord: (word: string) => void} | null>(null);


export default function ShowEntry(props: ShowEntryProps) {
    return (
        <EntryHandlerContext.Provider value={{onOpenWord: props.onOpenWord}}>
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
                    <div className="flex flex-col gap-y-6">
                        {props.entry.def?.map((def: DefinitionData, j: number) => (
                            <div 
                                key={j}
                                className="flex flex-col"
                            >
                                {def.vd && 
                                    <p className="block text-sm text-neutral-400 tracking-wide uppercase font-medium">
                                        {def.vd}
                                    </p>
                                }
                                {def.sls && def.sls.map((label: string, i: number) => (
                                    <p key={i} className="block text-sm text-neutral-400 tracking-wide uppercase font-medium">
                                        {label}
                                    </p>
                                ))}
                                <div className="flex flex-col gap-y-4">
                                    {def.sseq.map((seq: SenseSequenceElement[], seqIndex: number) => (
                                        <Fragment key={seqIndex}>
                                            <Sequence
                                                sequence={seq}
                                                sequenceNum={seqIndex+1}
                                            />
                                        </Fragment>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </EntryHandlerContext.Provider>
    )
}