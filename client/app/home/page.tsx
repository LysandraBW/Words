"use client";
import { BookType } from "@/services/db/book";
import { selectReader, ReaderType } from "@/services/db/reader";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"
import CreateBook from "./CreateBook";
import CreateDeck from "./CreateDeck";
import { DeckType, deleteDeck as deleteDeckDB } from "@/services/db/deck";
import { ChapterType } from "@/services/db/chapter";
import loadData from "./loadData";
import ShowWords from "@/components/ShowWords";
import ShowDecks from "./ShowDecks";
import ShowBooks from "./ShowBooks";
import ShowDecksGraded from "./ShowDecksGraded";


export interface BookToChapters {
    [bookID: number]: ChapterType[];
}


export default function Page() {
    const router = useRouter();
    const [user, setUser] = useState<ReaderType>();
    const [data, setData] = useState<Awaited<ReturnType<typeof loadData>>>();
    const [show, setShow] = useState('');


    useEffect(() => {
        const load = async () => {
            const user = await selectReader();
            if (!user)
                return router.push('/signIn');
            setUser(user);

            try {
                const data = await loadData();
                setData(data);
            }
            catch (err) {
                alert((err as Error).message);
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


    const deleteDeck = async (deckID: number) => {
        const deletedDeck = await deleteDeckDB(deckID);
        if (!deletedDeck)
            throw new Error('Failed to Create Book');
        return deletedDeck;
    }


    const onDeleteDeck = async (deckID: number) => {
        try {
            const deletedDeck = await deleteDeck(deckID);
            handleDeckDeleted(deletedDeck);
        }
        catch (err) {
            alert((err as Error).message);
        }
    }

    
    if (!user || !data) 
        return <>Loading...</>;

    
    return (
        <div className="w-full h-full grid grid-cols-[0px_1fr] bg-black overflow-y-scroll">
            <div className="flex col-start-2">
                <ShowWords
                    words={data.words}
                    decksGraded={data.decksGraded}
                />
                <ShowDecks
                    decks={data.decks}
                    onCreateDeck={() => setShow('Create Deck')}
                    onDeleteDeck={onDeleteDeck}
                />
                <ShowBooks
                    books={data.books}
                    onCreateBook={() => setShow('Create Book')}
                />
                <ShowDecksGraded
                    decksGraded={data.decksGraded}
                />
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
        </div>
    )
}