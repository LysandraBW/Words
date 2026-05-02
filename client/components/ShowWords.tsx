import useSortWords, { ASCENDING, DESCENDING } from "@/hooks/useSortWords";
import { DeckGradedType } from "@/services/server/deckGraded";
import { WordType } from "@/services/server/word";
import getWordData, { WordData } from "@/utilities/wordData";
import { Fragment, useEffect, useState } from "react";
import InputDropdown from "./input/InputDropdown";
import clsx from "clsx";
import InputText from "./input/InputText";
import { MoveDownIcon, MoveUpIcon, XIcon } from "lucide-react";
import getWordEntries, { Entry } from "@/services/words/getWordEntry";
import ShowEntry from "./word/ShowEntry";
import { Rnd } from "react-rnd";


interface ShowWordsProps {
    words: WordType[];
    decksGraded: DeckGradedType[];
}


export default function ShowWords(props: ShowWordsProps) {
    const [wordsData, setWordsData] = useState<{[word: string]: WordData}>();
    const words = useSortWords(props.words, wordsData);
    const [showing, setShowing] = useState<{[word: string]: {entries: Entry[], z: number}}|null>();


    useEffect(() => {
        const load = async () => {
            const wordsData = await getWordData(props.decksGraded, props.words.map(word => word.word[0]));
            setWordsData(wordsData);
            openWord('test');
        }
        load();
    }, [props.words, props.decksGraded]);


    useEffect(() => {
        console.log(showing);
    }, [showing]);


    const openWord = async (word: string) => {
        let wordEntries = await getWordEntries(word);
        // wordEntries = wordEntries.filter((entry: any) => entry.def && entry.hom);
        console.log(wordEntries);
        setShowing(showing => {
            return {
                ...showing,
                [word]: {
                    entries: wordEntries,
                    z: 100
                }
            }
        });
    }


    const closeWord = (word: string) => {
        setShowing(showing => {
            const updatedShowing = {...showing};
            delete updatedShowing[word];
            return updatedShowing;
        });
    }


    return (
        <section className="w-full max-h-[700px] flex">
            <div className="w-full">
                <div className="w-fit m-4 mb-0 flex items-center bg-zinc-900 border-y border-zinc-800 rounded-md">
                    <InputText
                        value={words.search}
                        onChange={words.setSearch}
                        placeholder="Search Words" 
                        wrapperClassName="w-fit"
                        inputWrapperClassName="rounded-r-none border-l border-zinc-800"
                    />
                    <InputDropdown
                        options={words.sortOptions}
                        value={[words.sort]}
                        toggleLabel="Sort Words"
                        onChange={(value: string) => words.setSort(value)}
                        toggleClassName="border-x border-x-zinc-800 pr-2 gap-x-4 rounded-none"
                    />
                    <button
                        className="h-[36px] w-[36px] p-0.5 flex justify-center items-center -space-x-2 border-r border-zinc-800 hover:bg-zinc-800 cursor-pointer rounded-r-md"
                        onClick={() => words.setDirection(words.nextDirection(words.direction))}
                    >
                        <MoveUpIcon
                            size={18}
                            strokeWidth={2}
                            className={clsx(
                                words.direction === ASCENDING && '!text-green-500',
                                "text-zinc-500 [transform:scaleY(0.8375)]"
                            )}
                        />
                        <MoveDownIcon
                            size={18}
                            strokeWidth={2}
                            className={clsx(
                                words.direction === DESCENDING && '!text-green-500',
                                "text-zinc-500 [transform:scaleY(0.8375)]"
                            )}
                        />
                    </button>
                </div>
                <div className="p-4 flex flex-wrap gap-4">
                    {(words.sortedWords || props.words).map((word, i) => (
                        <button 
                            key={i}
                            className={clsx(
                                "h-[max(100%,100px)] p-2",
                                "flex flex-col gap-y-2",
                                "overflow-hidden",
                                "bg-zinc-900 border border-zinc-800 rounded-md group hover:bg-zinc-800 cursor-pointer"
                            )}
                            onClick={async () => openWord(word.word[0])}
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
            {showing && Object.entries(showing).map(([word, entries]) => (
                <Rnd
                    key={word}
                    default={{
                        x: window.innerWidth / 2 - 300,
                        y: window.innerHeight / 2 - 200,
                        width: 600,
                        height: 400
                    }}
                    maxWidth={window.innerWidth - 100}
                    maxHeight={window.innerHeight - 100}
                    style={{
                        zIndex: entries.z
                    }}
                    
                >
                    <div className="h-full w-full flex flex-col border border-zinc-700 bg-zinc-800 overflow-y-auto shadow-lg">
                        <div className="w-full flex items-center justify-between sticky top-0 bg-zinc-800 z-10">
                            <span className="p-2 text-xs text-zinc-500 uppercase font-bold tracking-wide">
                                {word}
                            </span>
                            <button 
                                className="p-2 group hover:bg-red-500"
                                onClick={() => closeWord(word)}
                            >
                                <XIcon
                                    size={16}
                                    strokeWidth={2}
                                    className="cursor-pointer text-white group-hover:text-white"
                                />
                            </button>
                        </div>
                        <div className="w-full p-4 pt-0 flex flex-col gap-y-10">
                            {entries.entries.map((entry: Entry, i: number) => (
                                <div
                                    key={i}
                                    onClick={() => {
                                        setShowing(showing => {
                                            if (!showing)
                                                return showing;
                                            console.log('click')
                                            return Object.fromEntries(
                                                Object.entries(showing).map(([w, i]) => {
                                                    i.z = w === word ? 200 : 100
                                                    return [w, i];
                                                })
                                            );
                                        })
                                    }}
                                >
                                    <ShowEntry
                                        entry={entry}
                                        entryNum={i+1}
                                        numEntries={entries.entries.length}
                                        onOpen={openWord}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </Rnd>
            ))}
        </section>
    )
}