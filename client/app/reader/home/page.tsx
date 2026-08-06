"use client";
import loadData from "@/app/reader/home/loadData";
import { BookType } from "@/services/server/book";
import { DeckType, deleteDeck } from "@/services/server/deck";
import getWordEntries, { Entry } from "@/services/words/getWordEntry";
import clsx from "clsx";
import { BookIcon, CircleDashedIcon, ClipboardIcon, LibraryIcon, TextInitialIcon, TriangleIcon } from "lucide-react";
import { useEffect, useState } from "react";
import BookTab from "../BookTab";
import ChapterTab from "../ChapterTab";
import WordTab from "../WordTab";
import DeckTab from "../DeckTab";
import CreateDeck from "@/app/reader/home/CreateDeck";
import CreateBook from "@/app/reader/home/CreateBook";
import Card from "./Card";
import Tab from "./Tab";

export default function Page() {
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
        <div className="grid grid-cols-1 grid-rows-[auto_auto_1fr]">
            <div className="h-min p-4 flex gap-x-4 border-b border-b-neutral-800">
                <Card
                    Icon={CircleDashedIcon}
                    cardKey="Card Label"
                    cardValue="1000"
                    cardKeyContext="in a Month"
                    cardValueChange={50}
                />
                <Card
                    Icon={CircleDashedIcon}
                    cardKey="Card Label"
                    cardValue="1000"
                    cardKeyContext="in a Month"
                    cardValueChange={10}
                />
                <Card
                    Icon={CircleDashedIcon}
                    cardKey="Card Label"
                    cardValue="1000"
                    cardKeyContext="in a Month"
                    cardValueChange={99}
                />
                <Card
                    Icon={CircleDashedIcon}
                    cardKey="Card Label"
                    cardValue="1000"
                    cardKeyContext="in a Month"
                    cardValueChange={50}
                />
            </div>
            <div className="w-full p-2 grid grid-cols-4 gap-x-2 bg-neutral-900 border-b border-b-neutral-800">
                <Tab
                    TabIcon={LibraryIcon}
                    tabLabel="Books"
                    selected={tabIndex === 0}
                    onClick={() => setTabIndex(0)}
                />
                <Tab
                    TabIcon={BookIcon}
                    tabLabel="Chapters"
                    selected={tabIndex === 1}
                    onClick={() => setTabIndex(1)}
                />
                <Tab
                    TabIcon={TextInitialIcon}
                    tabLabel="Words"
                    selected={tabIndex === 2}
                    onClick={() => setTabIndex(2)}
                />
                <Tab
                    TabIcon={ClipboardIcon}
                    tabLabel="Decks"
                    selected={tabIndex === 3}
                    onClick={() => setTabIndex(3)}
                />
            </div>
            <div className="p-2 bg-neutral-950 grid grid-rows-[auto_1fr] grid-cols-1 gap-y-2 overflow-auto">
                {tabIndex === 0 &&
                    <BookTab
                        books={data?.books || []}
                        onDelete={() => 0}
                        onCreate={() => setShow('Create Book')}
                    />
                }
                {tabIndex === 1 &&
                    <ChapterTab
                        chapters={data?.chapters || []}
                        onDelete={() => 0}
                        onCreate={() => setShow('Create Chapter')}
                    />
                }
                {tabIndex === 2 &&
                    <WordTab
                        words={data?.words || []}
                        decksGraded={data?.decksGraded || []}
                        lookup={wordLookup || null}
                        onOpenWord={onOpenWord}
                        onCloseWord={onCloseWord}
                        onBringWordToFront={onBringWordToFront}
                        setLookup={setWordLookup}
                        onDelete={() => 0}
                        onCreate={() => setShow('Create Word')}
                    />
                }
                {tabIndex === 3 &&
                    <DeckTab
                        decks={data?.decks || []}
                        decksGraded={data?.decksGraded || []}
                        onCreate={() => setShow('Create Deck')}
                        onDelete={() => 0}
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