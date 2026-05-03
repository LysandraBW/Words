"use client";
import { BookType } from "@/services/server/book";
import { useEffect, useState } from "react"
import CreateBook from "./CreateBook";
import CreateDeck from "./CreateDeck";
import { DeckType, deleteDeck as deleteDeck } from "@/services/server/deck";
import { ChapterType } from "@/services/server/chapter";
import loadData from "./loadData";
import ShowWords from "@/components/ShowWords";
import ShowDecks from "./ShowDecks";
import ShowBooks from "./ShowBooks";
import ShowDecksGraded from "./ShowDecksGraded";
import SearchWords from "./SearchWords";
import getWordEntries, { Entry } from "@/services/words/getWordEntry";


export interface BookToChapters {
    [bookID: number]: ChapterType[];
}


export default function Page() {
    const [data, setData] = useState<Awaited<ReturnType<typeof loadData>>>();
    const [show, setShow] = useState('');
    // Words
    const [lookup, setLookup] = useState<{[word: string]: {entries: Entry[], z: number}}|null>();


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
        setLookup(showing => {
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
        setLookup(showing => {
            const updatedShowing = {...showing};
            delete updatedShowing[word];
            return updatedShowing;
        });
    }


    const onRaiseWord = (word: string) => {
        setLookup(lookup => {
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
        <div className="w-full h-full grid grid-cols-[0px_1fr] bg-black overflow-y-auto relative">
            <div className="flex flex-col col-start-2">
                <SearchWords
                    onOpenWord={onOpenWord}
                />
                <Divider/>
                <ShowBooks
                    books={data.books}
                    onCreateBook={() => setShow('Create Book')}
                />
                <Divider/>
                <ShowWords
                    words={data.words}
                    decksGraded={data.decksGraded}
                    onOpenWord={onOpenWord}
                    onCloseWord={onCloseWord}
                    onRaiseWord={onRaiseWord}
                    lookup={lookup || null}
                    setLookup={setLookup}
                />
                <Divider/>
                <ShowDecks
                    decks={data.decks}
                    decksGraded={data.decksGraded}
                    onCreateDeck={() => setShow('Create Deck')}
                    onDeleteDeck={onDeleteDeck}
                />
            </div>
            {show === 'Create Deck' &&
                <CreateDeck
                    books={data.books}
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


function Divider() {
    return <div className="w-full h-[1px] bg-zinc-900"/>
}