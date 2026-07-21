"use client";
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react";
import { CaseUpperIcon, EllipsisIcon, MoveLeftIcon, PlayIcon, RefreshCwIcon, TrashIcon } from "lucide-react";
import { reloadDeck, deleteDeck, updateDeck } from "@/services/server/deck";
import { DeckGradedType, deleteDeckGraded, insertDeckGraded } from "@/services/server/deckGraded";
import loadData from "../../deck/loadData";
import { WordType } from "@/services/server/word";
import clsx from "clsx";
import WordTab from "../WordTab";
import getWordEntries, { Entry } from "@/services/words/getWordEntry";
import TakeQuiz from "./TakeQuiz";


export default function Page() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const deckID = searchParams.get('deckID');
    
    if (!deckID)
        return router.back();
    
    const [data, setData] = useState<Awaited<ReturnType<typeof loadData>>>();
    const [show, setShow] = useState<string|DeckGradedType>('Quiz');

    const tabs = ["Words", "Attempts"];
    const [tabIndex, setTabIndex] = useState(0);

    const [wordLookup, setWordLookup] = useState<{[word: string]: {entries: Entry[], z: number}}|null>();

    useEffect(() => {
        const load = async () => {
            try {
                const data = await loadData(Number(deckID));
                setData(data);
            }
            catch (err) {
                alert(err);
            }
        }
        load();
    }, []);


    const handleDeckUpdated = (deck: Awaited<ReturnType<typeof updateDeck>>, words: WordType[]) => {
        setData(data => {
            if (!data)
                return data;
            return {
                ...data,
                deck,
                words
            }
        });
        setShow('');
    }


    const handleDeckGradedDeleted = (deletedDeckGraded: Awaited<ReturnType<typeof deleteDeckGraded>>) => {
        setData(data => {
            if (!data)
                return data;
            return {
                ...data,
                decksGraded: data.decksGraded.filter(deck => deck.deck_graded_id !== deletedDeckGraded.deck_graded_id),
            }
        });
        setShow('');
    }


    const handleDeckReloaded = (deck: Awaited<ReturnType<typeof reloadDeck>>) => {
        setData(data => {
            if (!data)
                return data;
            return {
                ...data,
                deck
            }
        });
        setShow('');
    }


    const onDeleteDeckGraded = async (deckGradedID: number) => {
        try {
            const deletedDeckGraded = await deleteDeckGraded(deckGradedID);
            handleDeckGradedDeleted(deletedDeckGraded);
        }
        catch (err) {
            alert(err);
        }
    }


    const onReloadDeck = async (deckID: number) => {
        try {
            const deckCards = await reloadDeck(deckID);
            handleDeckReloaded(deckCards);
        }
        catch (err) {
            alert(err);
        }
    }


    const handleDeckGradedCreated = (deckGraded: Awaited<ReturnType<typeof insertDeckGraded>>) => {
        setData(data => {
            if (!data)
                return data;
            return {
                ...data,
                decksGraded: [
                    ...data.decksGraded, 
                    {
                        ...data.deck, 
                        ...deckGraded
                    }
                ]
            }
        });
        setShow('');
    }


    const onDeleteDeck = async (deckID: number) => {
        try {
            await deleteDeck(deckID);
            router.back();
        }
        catch (err) {
            alert(err);
        }
    }


    const onShowQuizResults = async (deckGraded: DeckGradedType) => {
        setShow(deckGraded);
    }


    const onOpenWord = async (word: string) => {
        let wordEntries = await getWordEntries(word);
        setWordLookup(showing => {
            return {
                ...showing,
                [word]: {
                    entries: wordEntries,
                    z: 100
                }
            }
        });
    }


    const onCloseWord = (word: string) => {
        setWordLookup(showing => {
            const updatedShowing = {...showing};
            delete updatedShowing[word];
            return updatedShowing;
        });
    }


    const onBringWordToFront = (word: string) => {
        setWordLookup(lookup => {
            if (!lookup)
                return lookup;
            return Object.fromEntries(
                Object.entries(lookup).map(([w, i]) => {
                    i.z = w === word ? 200 : 100
                    return [w, i];
                })
            );
        })
    }

        
    if (!data)
        return <>Loading</>;


    return (
        <div className="grid grid-rows-[auto_1fr] h-full">
            <div className="h-[200px] grid grid-cols-2 bg-neutral-900">
                <div className="relative p-4 flex flex-col justify-center gap-y-6">
                    <div className="absolute top-4 left-4 flex items-center gap-x-1 text-sm text-neutral-400">
                        <div className="w-[24px] aspect-square flex items-center justify-center bg-neutral-800 border border-neutral-700/50 rounded-md shadow-sm">
                            <MoveLeftIcon
                                size={14}
                                strokeWidth={2}
                                className="stroke-neutral-500"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col justify-center -space-y-1">
                        <p className="block text-lg font-normal text-neutral-300">
                            {data.deck.deck_name}
                        </p>
                        <p className="block text-2xl font-medium text-neutral-100 max-w-xs text-shadow-sm">
                            {data.deck.deck_questions.length} Questions
                        </p>
                    </div>
                </div>
                <div className="p-4 h-min flex gap-x-2 justify-end">
                    <button className="w-[24px] aspect-square flex items-center justify-center bg-neutral-800 border border-neutral-700/50 rounded-md shadow-sm">
                        <PlayIcon
                            size={14}
                            strokeWidth={2}
                            className="stroke-neutral-500"
                        />
                    </button>
                    <button className="w-[24px] aspect-square flex items-center justify-center bg-neutral-800 border border-neutral-700/50 rounded-md shadow-sm">
                        <RefreshCwIcon
                            size={14}
                            strokeWidth={2}
                            className="stroke-neutral-500"
                        />
                    </button>
                    <button className="w-[24px] aspect-square flex items-center justify-center bg-neutral-800 border border-neutral-700/50 rounded-md shadow-sm">
                        <EllipsisIcon
                            size={14}
                            strokeWidth={2}
                            className="stroke-neutral-500"
                        />
                    </button>
                    <button className="w-[24px] aspect-square flex items-center justify-center bg-neutral-800 border border-neutral-700/50 rounded-md shadow-sm">
                        <TrashIcon
                            size={14}
                            strokeWidth={2}
                            className="stroke-neutral-500"
                        />
                    </button>
                </div>
            </div>
            {show !== 'Quiz' &&
                <>
                    {/* Tabs */}
                    <div className="w-full p-2 grid grid-cols-2 gap-x-2 bg-neutral-900/50 border-y border-neutral-800">
                        {tabs.map((tab, i) => (
                            <div 
                                key={i}
                                onClick={() => setTabIndex(i)}
                                className={clsx(
                                    "py-1 px-2 flex justify-center items-center gap-x-2 border border-transparent rounded-lg text-sm text-neutral-500/75",
                                    i !== tabIndex && "cursor-pointer hover:bg-neutral-800 hover:scale-97",
                                    i === tabIndex && "bg-neutral-700 !border-neutral-600 shadow-md !text-neutral-200"
                                )}
                            >
                                <p
                                    className={clsx(
                                        "flex items-center gap-x-2 text-xs text-neutral-500/75 tracking-wide rounded-md",
                                        i !== tabIndex && "cursor-pointer hover:bg-white/10 hover:scale-97 transition-all",
                                        i === tabIndex && "!text-neutral-200 font-medium"
                                    )}
                                >
                                    {tab === "Words" &&
                                        <CaseUpperIcon
                                            size={14}
                                            strokeWidth={1.5}
                                            className="relative top-[1px]"
                                        />
                                    }
                                    {tab}
                                </p>
                                
                            </div>
                        ))}
                    </div>
                    <div className="p-2">
                        {tabIndex === 0 &&
                            <WordTab
                                words={data?.words || []}
                                decksGraded={data?.decksGraded || []}
                                onOpenWord={onOpenWord}
                                onCloseWord={onCloseWord}
                                onBringWordToFront={onBringWordToFront}
                                lookup={wordLookup || null}
                                setLookup={setWordLookup}
                            />
                        }
                    </div>
                </>
            }
            {show === 'Quiz' &&
                <TakeQuiz
                    deck={data.deck}
                    onClose={() => setShow('')}
                    onQuizFinished={handleDeckGradedCreated}
                />
            }
        </div>
    )
}