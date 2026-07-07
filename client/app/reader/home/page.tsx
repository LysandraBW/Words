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
import { BookIcon, ChevronLeftIcon, ChevronRightIcon, ChevronsLeftIcon, ChevronsRightIcon, ClipboardIcon, LayoutGridIcon, LayoutListIcon, LibraryIcon, MinusIcon, MoveDownIcon, MoveUpIcon, NotepadText, TrashIcon, WholeWordIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Option } from "@/components/input/InputDropdown";
import BookTab from "../BookTab";
import ChapterTab from "../ChapterTab";
import WordTab from "../WordTab";

export default function Page() {
    const tabs = ["Books", "Chapters", "Words", "Decks"];
    const [tabIndex, setTabIndex] = useState(0);
    
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
        <div className="flex flex-col">
            <div className="w-full min-h-[196px] max-h-[196px] p-4 grid grid-cols-4 gap-x-4 border-b border-b-neutral-800">
                {/* Statistics */}
                {[...Array(4)].map((e, i) => (
                    <div 
                        key={i}
                        className="bg-neutral-900 border border-neutral-800 rounded-lg shadow"
                    >
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
                            "py-1 px-2 flex justify-center items-center gap-x-2 border border-transparent rounded-lg text-sm text-neutral-500/75",
                            i !== tabIndex && "cursor-pointer hover:bg-neutral-800 hover:scale-97",
                            i === tabIndex && "bg-blue-600 !border-blue-500 shadow-md !text-neutral-200 font-medium"
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
                            <WholeWordIcon
                                size={18}
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
            <div className="p-2">
                {tabIndex === 0 &&
                    <BookTab
                        books={data?.books || []}
                    />
                }
                {tabIndex === 1 &&
                    <ChapterTab
                        chapters={data?.chapters || []}
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
            </div>
        </div>
    )
}