import useSortWords, { ASCENDING, DESCENDING } from "@/hooks/useSortWords";
import { DeckGradedType } from "@/services/server/deckGraded";
import { WordType } from "@/services/server/word";
import getWordData, { WordData } from "@/utilities/wordData";
import { Dispatch, Fragment, SetStateAction, useEffect, useState } from "react";
import InputDropdown from "./input/InputDropdown";
import clsx from "clsx";
import InputText from "./input/InputText";
import { MoveDownIcon, MoveUpIcon } from "lucide-react";
import getWordEntries, { Entry } from "@/services/words/getWordEntry";
import DraggableWord from "./DraggableWord";
import { pixelifySans } from "@/app/fonts";


interface ShowWordsProps {
    words: WordType[];
    decksGraded: DeckGradedType[];
    lookup: {[word: string]: {entries: Entry[], z: number}}|null;
    setLookup: Dispatch<SetStateAction<{
        [word: string]: {
            entries: Entry[];
            z: number;
        };
    } | null | undefined>>;
    onOpenWord: (word: string) => void;
    onCloseWord: (word: string) => void;
    onRaiseWord: (word: string) => void;
}


export default function ShowWords(props: ShowWordsProps) {
    const [wordsData, setWordsData] = useState<{[word: string]: WordData}>();
    const words = useSortWords(props.words, wordsData);


    useEffect(() => {
        const load = async () => {
            const wordsData = await getWordData(props.decksGraded, props.words.map(word => word.word[0]));
            setWordsData(wordsData);
        }
        load();
    }, [props.words, props.decksGraded]);


    return (
        <section className="w-full max-h-[700px] flex">
            <div className="w-full">
                <div className="w-fit m-4 mb-0 flex items-center bg-neutral-900 border-y border-neutral-800 rounded-md">
                    <InputText
                        value={words.search}
                        onChange={words.setSearch}
                        placeholder="Search Words" 
                        wrapperClassName="w-fit"
                        inputWrapperClassName="rounded-r-none border-y-0 border-r-0 border-l border-neutral-800"
                    />
                    <InputDropdown
                        options={words.sortOptions}
                        value={[words.sort]}
                        toggleLabel="Sort Words"
                        onChange={(value: string) => words.setSort(value)}
                        toggleClassName="border-y-0  border-x border-x-neutral-800 pr-2 gap-x-4 rounded-none"
                    />
                    <button
                        className="h-[36px] w-[36px] p-0.5 flex justify-center items-center -space-x-2 border-r border-neutral-800 hover:bg-neutral-800 cursor-pointer rounded-r-md"
                        onClick={() => words.setDirection(words.nextDirection(words.direction))}
                    >
                        <MoveUpIcon
                            size={18}
                            strokeWidth={2}
                            className={clsx(
                                words.direction === ASCENDING && '!text-green-500',
                                "text-neutral-500 [transform:scaleY(0.8375)]"
                            )}
                        />
                        <MoveDownIcon
                            size={18}
                            strokeWidth={2}
                            className={clsx(
                                words.direction === DESCENDING && '!text-green-500',
                                "text-neutral-500 [transform:scaleY(0.8375)]"
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
                                "bg-neutral-900 border border-neutral-800 rounded-md group hover:bg-neutral-800 cursor-pointer"
                            )}
                            onClick={async () => props.onOpenWord(word.word[0])}
                        >
                            <div>
                                <h6 className="h-[24px] w-[300px] font-medium text-neutral-500 text-sm tracking-wide capitalize text-left">
                                    {word.word[0]}
                                </h6>
                                <p className="w-[300px] max-w-[300px] text-neutral-500 text-sm tracking-wide overflow-hidden text-ellipsis line-clamp-2 text-left">
                                    {word.word[1]}
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-1">
                                <span 
                                    className={clsx(
                                        pixelifySans.className,
                                        "py-1 px-2 flex items-center text-xs tracking-wide text-blue-500 bg-black/20 group-hover:bg-black/20 rounded-md"
                                    )}
                                >
                                    {/* Seen */}
                                    <span
                                        className={clsx(
                                            pixelifySans.className,
                                            'text-green-500'
                                        )}
                                    >
                                        {word.word_number_instances}x
                                    </span>
                                </span>
                                <span 
                                    className={clsx(
                                        pixelifySans.className,
                                        "py-1 px-2 text-xs tracking-wide text-blue-500 bg-black/20 group-hover:bg-black/20 rounded-md"
                                    )}
                                >
                                    {wordsData && (
                                        <span
                                            className={clsx(
                                                pixelifySans.className,
                                                wordsData[word.word[0]].accuracy * 100 >= 76 ? 'text-green-500' : wordsData[word.word[0]].accuracy * 100 >= 60 ? 'text-yellow-400' : 'text-red-500'
                                            )}
                                        >
                                            {(wordsData[word.word[0]].accuracy * 100).toFixed(0)}%
                                        </span>
                                    )}
                                    {/* Acc. */}
                                </span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
            {props.lookup && Object.entries(props.lookup).map(([word, wordLookupInfo]) => (
                <Fragment key={word}>
                    <DraggableWord
                        word={word}
                        entries={wordLookupInfo.entries}
                        zIndex={wordLookupInfo.z}
                        onOpenWord={props.onOpenWord}
                        onCloseWord={props.onCloseWord}
                        onRaiseWord={props.onRaiseWord}
                    />
                </Fragment>
            ))}
        </section>
    )
}
