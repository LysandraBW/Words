"use client";
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react";
import { EllipsisIcon, LightbulbIcon, PlayIcon, RefreshCwIcon, TextInitialIcon, TrashIcon, XIcon } from "lucide-react";
import { reloadDeck, deleteDeck, updateDeck } from "@/services/server/deck";
import { DeckGradedType, deleteDeckGraded, insertDeckGraded } from "@/services/server/deckGraded";
import loadData from "./loadData";
import { WordType } from "@/services/server/word";
import clsx from "clsx";
import WordTab from "../WordTab";
import getWordEntries, { Entry } from "@/services/words/getWordEntry";
import TakeQuiz from "./TakeQuiz";
import IconButton from "@/components/ui/IconButton";
import Tab from "../home/Tab";
import DeckGradedTab from "../DeckGradedTab";
import UpdateDeck from "@/app/reader/deck/UpdateDeck";


export default function Page() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const deckID = searchParams.get('deckID');
    
    if (!deckID)
        return router.back();
    
    const [data, setData] = useState<Awaited<ReturnType<typeof loadData>>>();
    const [show, setShow] = useState<string|DeckGradedType>('');
    
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


    const onDeleteDeckGraded = async (deckGradedIDs: number[]) => {
        try {
            await Promise.all(deckGradedIDs.map((id) => (
                async () => {
                    const deletedDeckGraded = await deleteDeckGraded(id);
                    handleDeckGradedDeleted(deletedDeckGraded);
                }
            )));
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
        <div 
            className={clsx(
                "grid grid-rows-[auto_auto_1fr] h-full",
                show === 'Quiz' && "!grid-rows-[auto_1fr]"
            )}    
        >
            <div 
                className={clsx(
                    "h-[156px] grid grid-cols-2 bg-neutral-900 transition-all",
                    show === 'Quiz' && '!h-min !block'
                )}
            >
                <div 
                    className={clsx(
                        "relative p-4 flex flex-col justify-center gap-y-6 gap-x-2",
                        show === 'Quiz' && '!h-min !pb-2 !block'
                    )}
                >
                    {show !== 'Quiz' &&
                        <>
                            <div className="flex flex-col justify-center -space-y-1">
                                <p className="block text-lg font-normal text-neutral-300">
                                    {data.deck.deck_questions.length} Question{data.deck.deck_questions.length === 1 ? "" : "s"}
                                </p>
                                <p className="block text-2xl font-medium text-neutral-100 max-w-xs text-shadow-sm">
                                    {data.deck.deck_name}
                                </p>
                            </div>
                        </>
                    }
                    {show === 'Quiz' &&
                        <>
                            <div className="w-full">
                                <div className="">
                                    <div 
                                        className={clsx(
                                            "ml-3 flex justify-between bg-neutral-950/50 rounded-lg normal-case",
                                            "relative before:h-[calc(100%-8px)] before:w-[4px] before:rounded-full before:bg-blue-500 before:border before:border-blue-500 before:top-[4px] before:left-[-10px] before:absolute"
                                        )}
                                    >
                                        <div className="py-5 px-2 relative">
                                            <p className="text-neutral-100 font-medium text-xl">
                                                Taking {data?.deck.deck_name}
                                            </p>
                                        </div>
                                        <div className="h-min p-1.5 flex gap-x-1.5">
                                            <IconButton
                                                Icon={XIcon}
                                                onClick={() => setShow('')}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    }
                    {(show && typeof show !== 'string') &&
                        <>
                            <div className="w-full">
                                <div className="">
                                    <div 
                                        className={clsx(
                                            "ml-3 flex justify-between bg-neutral-950/50 rounded-lg normal-case",
                                            "relative before:h-[calc(100%-8px)] before:w-[4px] before:rounded-full before:bg-blue-500 before:border before:border-blue-500 before:top-[4px] before:left-[-10px] before:absolute"
                                        )}
                                    >
                                        <div className="py-5 px-2 relative">
                                            <p className="text-neutral-100 font-medium text-xl">
                                                {data?.deck.deck_name} Results
                                            </p>
                                        </div>
                                        <div className="h-min p-1.5 flex gap-x-1.5">
                                            <IconButton
                                                Icon={XIcon}
                                                onClick={() => setShow('')}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    }
                </div>
                <div 
                    className={clsx(
                        "p-4 h-min flex gap-x-2 justify-end transition-all",
                        show === 'Quiz' && '!p-2 !hidden'
                    )}
                >
                    <IconButton
                        Icon={PlayIcon}
                        onClick={() => setShow('Quiz')}
                    />
                    <IconButton
                        Icon={RefreshCwIcon}
                        onClick={async () => onReloadDeck(data.deck.deck_id)}
                    />
                    <IconButton
                        Icon={EllipsisIcon}
                        onClick={async () => setShow('Update Deck')}
                    />
                    <IconButton
                        Icon={TrashIcon}
                        onClick={() => onDeleteDeck(data.deck.deck_id)}
                    />
                </div>
            </div>
            {show !== 'Quiz' &&
                <>
                    <div className="w-full p-2 grid grid-cols-2 gap-x-2 bg-neutral-900 border-y border-neutral-800">
                        <Tab
                            TabIcon={TextInitialIcon}
                            tabLabel="Words"
                            selected={tabIndex === 0}
                            onClick={() => setTabIndex(0)}
                        />
                        <Tab
                            TabIcon={LightbulbIcon}
                            tabLabel="Attempts"
                            selected={tabIndex === 1}
                            onClick={() => setTabIndex(1)}
                        />
                    </div>
                    <div className="p-2 bg-neutral-950 grid grid-rows-[auto_1fr] grid-cols-1 gap-y-2 overflow-auto">
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
                        {tabIndex === 1 &&
                            <DeckGradedTab
                                deck={data?.deck || []}
                                decksGraded={data?.decksGraded || []}
                                onDelete={onDeleteDeckGraded}
                                onClickObjectRow={onShowQuizResults}
                            />
                        }
                    </div>
                </>
            }
            {show === 'Quiz' &&
                <TakeQuiz
                    deck={data.deck}
                    deckGraded={(show && typeof show !== 'string') ? show : null}
                    onQuizFinished={handleDeckGradedCreated}
                    onClose={() => setShow('')}
                />
            }
            {show === 'Update Deck' &&
                <UpdateDeck
                    deck={data.deck}
                    books={data.books}
                    onDeckUpdated={handleDeckUpdated}
                    onClose={() => setShow('')}
                />
            }
        </div>
    )
}