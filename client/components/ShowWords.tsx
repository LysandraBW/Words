import useSortWords, { ASCENDING, DESCENDING } from "@/hooks/useSortWords";
import { DeckGradedType } from "@/services/server/deckGraded";
import { WordType } from "@/services/server/word";
import getWordData, { WordData } from "@/utilities/wordData";
import { Fragment, useEffect, useState } from "react";
import InputDropdown from "./input/InputDropdown";
import clsx from "clsx";
import { gamjaFlower } from "@/app/fonts";
import InputText from "./input/InputText";
import { ArrowDownIcon, ArrowUpIcon, MoveDownIcon, MoveUpIcon, SearchIcon, XIcon } from "lucide-react";
import CloseButton from "./CloseButton";
import getWordEntries from "@/services/words/getWordEntry";
import Inflection from "@/components/word/Inflections";
import Sense from "@/components/word/Sense";


interface ShowWordsProps {
    words: WordType[];
    decksGraded: DeckGradedType[];
}


export default function ShowWords(props: ShowWordsProps) {
    const [wordsData, setWordsData] = useState<{[word: string]: WordData}>();
    const [wordEntries, setWordEntries] = useState<any>();
    const sortWords = useSortWords(props.words, wordsData);


    useEffect(() => {
        const load = async () => {
            const wordsData = await getWordData(props.decksGraded, props.words.map(word => word.word[0]));
            setWordsData(wordsData);
            loadWordEntries('turn');
        }
        load();
    }, [props.words, props.decksGraded]);


    useEffect(() => {
        console.log(wordEntries);
    }, [wordEntries]);


    const loadWordEntries = async (word: string) => {
        let wordEntries = await getWordEntries(word);
        wordEntries = wordEntries.filter((entry: any) => entry.def && entry.hom);
        setWordEntries(wordEntries);
    }


    return (
        <section className="w-full max-h-[700px] flex">
            <div className="w-full">
                <div className="w-fit m-4 mb-0 flex items-center bg-zinc-900 border-y border-zinc-800 rounded-md">
                    <InputText
                        value={sortWords.search}
                        onChange={sortWords.setSearch}
                        placeholder="Search Words" 
                        wrapperClassName="w-fit"
                        inputWrapperClassName="rounded-r-none border-l border-zinc-800"
                    />
                    <InputDropdown
                        options={sortWords.sortOptions}
                        value={[sortWords.sort]}
                        toggleLabel="Sort Words"
                        onChange={(value: string) => sortWords.setSort(value)}
                        toggleClassName="border-x border-x-zinc-800 pr-2 gap-x-4 rounded-none"
                    />
                    <button
                        className="h-[36px] w-[36px] p-0.5 flex justify-center items-center -space-x-2 border-r border-zinc-800 hover:bg-zinc-800 cursor-pointer rounded-r-md"
                        onClick={() => sortWords.setDirection(sortWords.nextDirection(sortWords.direction))}
                    >
                        <MoveUpIcon
                            size={18}
                            strokeWidth={2}
                            className={clsx(
                                sortWords.direction === ASCENDING && '!text-green-500',
                                "text-zinc-500 [transform:scaleY(0.8375)]"
                            )}
                        />
                        <MoveDownIcon
                            size={18}
                            strokeWidth={2}
                            className={clsx(
                                sortWords.direction === DESCENDING && '!text-green-500',
                                "text-zinc-500 [transform:scaleY(0.8375)]"
                            )}
                        />
                    </button>
                </div>
                <div className="p-4 flex flex-wrap gap-4">
                    {(sortWords.sortedWords || props.words).map((word, i) => (
                        <button 
                            key={i}
                            className={clsx(
                                "h-[max(100%,100px)] p-2",
                                "flex flex-col gap-y-2",
                                "overflow-hidden",
                                "bg-zinc-900 border border-zinc-800 rounded-md group hover:bg-zinc-800 cursor-pointer"
                            )}
                            onClick={async () => loadWordEntries(word.word[0])}
                        >
                            <div>
                                <h6 className="h-[24px] w-[300px] font-medium text-zinc-300 text-sm tracking-wide capitalize text-left">
                                    {word.word[0]}
                                </h6>
                                <p className="w-[300px] max-w-[300px] text-zinc-500 text-sm tracking-wide overflow-hidden text-ellipsis line-clamp-2 text-left">
                                    {word.word[1]}
                                </p>
                            </div>
                            <div className="flex">
                                <span className="py-1 px-2 text-xs text-blue-500 bg-zinc-800 group-hover:bg-zinc-700 rounded-md">
                                    Seen {word.word_number_instances} Times
                                </span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
            {wordEntries &&
                <div
                    className="h-full w-[600px] min-w-[600px] max-w-[600px] p-4 flex flex-col gap-y-4 border-l border-zinc-900 border-dashed"
                >
                    <div className="w-full flex justify-end">
                        <XIcon
                            size={16}
                            strokeWidth={2}
                            onClick={() => setWordEntries(null)}
                            className="cursor-pointer text-zinc-700 hover:text-red-500"
                        />
                    </div>
                    <div className="flex flex-col gap-y-10 overflow-y-scroll">
                        {wordEntries && wordEntries.filter((entry: any) => entry.def).map((entry: any, i: number) => (
                            <div 
                                key={i}
                                className="w-full flex flex-col gap-y-10"
                            >
                                <div className="flex items-center gap-x-2"> 
                                    <h6 className="text-xl text-white font-bold capitalize tracking-wide uppercase">
                                        {entry.meta.id.split(":")[0]}
                                    </h6>
                                    <span
                                        className={clsx(
                                            "block px-2 py-0.5",
                                            gamjaFlower.className, "text-xl text-white",
                                            "bg-yellow-500 rounded-md"
                                        )}
                                    >
                                        {i+1}/{wordEntries.length}
                                    </span>
                                    <span
                                        className={clsx(
                                            "block px-2 py-0.5",
                                            gamjaFlower.className, "text-xl text-white capitalize",
                                            "bg-green-800 rounded-md"
                                        )}
                                    >
                                        {entry.fl}
                                    </span>
                                </div>
                                {entry.ins &&
                                    <Inflection
                                        ins={entry.ins}
                                    />
                                }
                                {entry.def.map((def: any, j: number) => (
                                    <div 
                                        key={j}
                                        className="flex flex-col"
                                    >
                                        {/* Ex: 'transitive verb' */}
                                        {def.vd && 
                                            <span className="block text-sm text-zinc-500 tracking-wide uppercase">
                                                {def.vd}
                                            </span>
                                        }
                                        {def.sls && def.sls.map((label: string, i: number) => (
                                            <span key={i}>
                                                {label}
                                            </span>
                                        ))}
                                        <div className="flex flex-col gap-y-12">
                                            {def.sseq.map((seq: any, k: number) => (
                                                <div key={k} className="grid grid-cols-[auto_1fr]">
                                                    <div className="w-6 min-w-6 flex flex-col items-center">
                                                        <span className="text-white font-medium">
                                                            {k+1}
                                                        </span>
                                                        <div className="w-[1px] h-full bg-gradient-to-b from-blue-500 to-blue-700">
                                                        </div>
                                                    </div>
                                                    <div 
                                                        key={k}
                                                        className="flex flex-col gap-y-4"
                                                    >
                                                        {seq.map((sense: any, x: number) => (
                                                            <div 
                                                                key={x}
                                                            >
                                                                {(sense[0] === "sense" || sense[0] === "sen" || sense[0] === "bs") &&
                                                                    <div 
                                                                        className="flex"
                                                                    >
                                                                        {(seq.length > 1 && sense[0] !== "bs") &&
                                                                            <div className="w-6 min-w-6 flex flex-col items-center">
                                                                                <span className="text-white font-medium">
                                                                                    {sense[1]["sn"].replaceAll(' ', '').at(-1)}
                                                                                </span>
                                                                                <div className="w-[1px] h-full bg-gradient-to-b from-red-500 to-red-700">
                                                                                </div>
                                                                            </div>
                                                                        }
                                                                        <Sense
                                                                            senseType={sense[0]}
                                                                            senseData={sense[1]}
                                                                        />
                                                                    </div>
                                                                }
                                                                {(sense[0] === "pseq") && (
                                                                    <div className="grid grid-cols-[auto_1fr]">
                                                                        <div className="w-4 min-w-4 flex flex-col items-center">
                                                                            <span className="text-white font-medium">
                                                                                {'abcdefghijklmnopqrstuvwxyz'[x]}
                                                                            </span>
                                                                            <div className="w-[1px] h-full bg-red-500">
                                                                            </div>
                                                                        </div>
                                                                        <div className="flex flex-col gap-y-4">

                                                                            {sense[1].map((partialSense: any, y: number) => (
                                                                                <div 
                                                                                    key={y}
                                                                                >
                                                                                    <div className="flex text-white">
                                                                                        {partialSense[0] !== 'bs' &&
                                                                                            <span className="w-4 min-w-4 overflow-clip block font-medium text-xs text-yellow-400 text-center whitespace-nowrap">
                                                                                                ({sense[1].slice(0, y).filter((s: any) => s[0] !== 'bs').length+1})
                                                                                            </span>
                                                                                        }
                                                                                        <Sense
                                                                                            senseType={partialSense[0]}
                                                                                            senseData={partialSense[1]}
                                                                                        />
                                                                                    </div>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            }
        </section>
    )
}