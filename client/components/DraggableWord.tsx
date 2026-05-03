import { Entry } from "@/services/words/getWordEntry";
import { XIcon } from "lucide-react";
import ShowEntry from "./word/ShowEntry";
import { Rnd } from "react-rnd";

interface DraggableWordProps {
    word: string;
    entries: Entry[];
    zIndex?: number;
    onCloseWord: (word: string) => void;
    onOpenWord: (word: string) => void;
    onRaiseWord: (word: string) => void;
}

export default function DraggableWord(props: DraggableWordProps) {
    return (
        <Rnd
            key={props.word}
            default={{
                x: window.innerWidth / 2 - 300,
                y: window.innerHeight / 2 - 200,
                width: 600,
                height: 400
            }}
            maxWidth={window.innerWidth - 100}
            maxHeight={window.innerHeight - 100}
            style={{
                zIndex: props.zIndex
            }}
            
        >
            <div className="h-full w-full flex flex-col border border-zinc-700 bg-zinc-800 overflow-y-auto shadow-lg">
                <div className="w-full flex items-center justify-between sticky top-0 bg-zinc-800 z-10">
                    <span className="p-2 text-xs text-zinc-500 uppercase font-bold tracking-wide">
                        {props.word}
                    </span>
                    <button 
                        className="p-2 group hover:bg-red-500"
                        onClick={() => props.onCloseWord(props.word)}
                    >
                        <XIcon
                            size={16}
                            strokeWidth={2}
                            className="cursor-pointer text-white group-hover:text-white"
                        />
                    </button>
                </div>
                <div className="w-full p-4 pt-0 flex flex-col gap-y-10">
                    {props.entries.map((entry: Entry, i: number) => (
                        <div
                            key={i}
                            onClick={() => props.onRaiseWord(props.word)}
                        >
                            <ShowEntry
                                entry={entry}
                                entryNum={i+1}
                                numEntries={props.entries.length}
                                onOpenWord={props.onOpenWord}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </Rnd>
    )
}