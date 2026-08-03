"use client";
import loadData from "@/app/home/loadData";
import InputCheckbox from "@/components/input/InputCheckbox/InputCheckbox";
import InputDropdown from "@/components/input/InputDropdown";
import InputText from "@/components/input/InputText";
import useFilterObjects, { ASCENDING, DESCENDING } from "@/hooks/useFilterObject";
import { BookType } from "@/services/server/book";
import { DeckType, deleteDeck } from "@/services/server/deck";
import getWordEntries, { Entry } from "@/services/words/getWordEntry";
import clsx from "clsx";
import { BookIcon, ChevronLeftIcon, ChevronRightIcon, ChevronsLeftIcon, ChevronsRightIcon, CircleDashedIcon, ClipboardIcon, LayoutGridIcon, LayoutListIcon, LibraryIcon, MinusIcon, MoveDownIcon, MoveUpIcon, NotepadText, TextInitialIcon, TrashIcon, TriangleIcon, TriangleRightIcon, WholeWordIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Option } from "@/components/input/InputDropdown";
import BookTab from "../BookTab";
import ChapterTab from "../ChapterTab";
import WordTab from "../WordTab";
import DeckTab from "../DeckTab";
import CreateDeck from "@/app/home/CreateDeck";
import CreateBook from "@/app/home/CreateBook";

export default function Page() {
    const tabs = ["Books", "Chapters", "Words", "Decks"];
    const [tabIndex, setTabIndex] = useState(2);
    
    const [data, setData] = useState<Awaited<ReturnType<typeof loadData>>>();
    const [show, setShow] = useState('');

    const [wordLookup, setWordLookup] = useState<{[word: string]: {entries: Entry[], z: number}}|null>();

    useEffect(() => {
        const load = async () => {
            try {
                const data = await loadData();
                setData(data);
            }
            catch (err) {
                alert(err);
            }
        }
        load();
    }, []);


    const handleBookCreated = (book: BookType) => {
        setData(data => {
            if (!data)
                return data;
            return {
                ...data,
                books: [
                    ...data.books, 
                    book
                ]
            }
        });
        setShow('');
    }


    const handleDeckCreated = (deck: DeckType) => {
        setData(data => {
            if (!data)
                return data;
            return {
                ...data,
                decks: [
                    ...data.decks, 
                    deck
                ]
            }
        });
        setShow('');
    }


    const handleDeckDeleted = (deck: DeckType) => {
        setData(data => {
            if (!data)
                return data;
            return {
                ...data,
                decks: data.decks.filter(d => d.deck_id !== deck.deck_id)
            }
        });
        setShow('');
    }


    const onDeleteDeck = async (deckID: number) => {
        try {
            const deletedDeck = await deleteDeck(deckID);
            handleDeckDeleted(deletedDeck);
        }
        catch (err) {
            alert(err);
        }
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


    return (
        <div className="grid grid-cols-1 grid-rows-[auto_auto_1fr]">
            {/* Statistics */}
            <div className="h-min p-4 flex gap-x-4 border-b border-b-neutral-800">
                {[...Array(4)].map((e, i) => (
                    <div 
                        key={i}
                        className="w-full h-[156px] p-4 flex flex-col justify-between bg-neutral-900 border border-neutral-800 rounded-lg shadow"
                    >
                        <div className="flex justify-between items-center">
                            <span
                                className="text-neutral-300"
                            >
                                Card Label
                            </span>
                            <CircleDashedIcon
                                size={16}
                                className="stroke-blue-500"
                            />
                        </div>
                        <div>
                            <div className="flex gap-x-2 items-center">
                                <span className="text-3xl text-neutral-100 font-medium">
                                    1,000
                                </span>
                                <span className="px-2 py-0.5 flex gap-x-2 items-center bg-green-600/10 rounded-full">
                                    <TriangleIcon
                                        size={10}
                                        className="rotate-90- fill-green-600 scale-y-60 stroke-green-700 font-medium"
                                    />
                                    <span className="text-xs text-green-600 font-medium">
                                        50%
                                    </span>
                                </span>
                            </div>
                            <span className="text-sm">
                                in a Month
                            </span>
                        </div>
                    </div>
                ))}
            </div>
            {/* Tabs */}
            <div className="w-full p-2 grid grid-cols-4 gap-x-2 bg-neutral-900 border-b border-b-neutral-800">
                {tabs.map((tab, i) => (
                    <div 
                        key={i}
                        onClick={() => setTabIndex(i)}
                        className={clsx(
                            "py-1 px-2 flex justify-center items-center gap-x-2 border border-transparent rounded-md text-sm text-neutral-500 font-medium",
                            i !== tabIndex && "bg-neutral-950/50 cursor-pointer hover:bg-neutral-950/75 hover:scale-97 transition-all",
                            i === tabIndex && "bg-blue-600 !border-blue-500 shadow-md !text-neutral-200"
                        )}
                    >
                        {tab === "Books" &&
                            <LibraryIcon
                                size={16}
                                strokeWidth={1.5}
                            />
                        }
                        {tab === "Chapters" &&
                            <BookIcon
                                size={16}
                                strokeWidth={1.5}
                            />
                        }
                        {tab === "Words" &&
                            <TextInitialIcon
                                size={16}
                                strokeWidth={1.5}
                            />
                        }
                        {tab === "Decks" &&
                            <ClipboardIcon
                                size={16}
                                strokeWidth={1.5}
                            />
                        }
                        {tab}
                    </div>
                ))}
            </div>
            <div className="p-2 bg-neutral-950 grid grid-rows-[auto_1fr] grid-cols-1 gap-y-2 overflow-auto">
                {tabIndex === 0 &&
                    <BookTab
                        books={data?.books || []}
                        onCreate={() => setShow('Create Book')}
                    />
                }
                {tabIndex === 1 &&
                    <ChapterTab
                        chapters={data?.chapters || []}
                        onCreate={() => setShow('Create Chapter')}
                    />
                }
                {tabIndex === 2 &&
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
                {tabIndex === 3 &&
                    <DeckTab
                        decks={data?.decks || []}
                        decksGraded={data?.decksGraded || []}
                        onCreate={() => setShow('Create Deck')}
                    />
                }
            </div>
            {show === 'Create Deck' &&
                <CreateDeck
                    books={data?.books || []}
                    onClose={() => setShow('')}
                    onDeckCreated={handleDeckCreated}
                />
            }
            {show === 'Create Book' &&
                <CreateBook
                    onClose={() => setShow('')}
                    onBookCreated={handleBookCreated}
                />
            }
        </div>
    )
}