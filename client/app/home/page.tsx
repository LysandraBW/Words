"use client";
import { BookType, getBooks } from "@/services/db/book";
import { getReader, ReaderType } from "@/services/db/reader";
import { useRouter } from "next/navigation";
import { Fragment, useEffect, useState } from "react"
import CreateBook from "./CreateBook";
import Book from "./Book";
import NavBar from "@/components/NavBar";
import CreateDeck from "./CreateDeck";
import { DeckCardType, DeckType, deleteDeck, getDeck, getDecks } from "@/services/db/deck";
import { DeckGradedType, DeckGradedCardType, getDecksGraded, getDeckGraded } from "@/services/db/deckGraded";
import Button from "@/components/Button";
import { TrashIcon } from "lucide-react";
import getWordAccuracies from "@/utilities/wordAccuracies";
import { WordType } from "@/services/db/word";

export default function Page() {
    const router = useRouter();
    const [user, setUser] = useState<ReaderType>();
    const [words, setWords] = useState<WordType[]>();
    const [books, setBooks] = useState<BookType[]>();
    const [decks, setDecks] = useState<DeckType[]>();
    const [showCreateDeck, setShowCreateDeck] = useState(true);
    const [showCreateBook, setShowCreateBook] = useState(false);

    const [decksGraded, setDecksGraded] = useState<DeckGradedType[]>();
    const [wordAccuracies, setWordAccuracies] = useState<{[word: string]: number}>();

    useEffect(() => {
        const load = async () => {
            const user = await getReader();
            if (!user)
                return router.push('/signIn');
            setUser(user);


            // Load Books
            const books = await getBooks();
            if (!books) {
                alert('Failed');
                return;
            }
            setBooks(books);


            // Load Decks
            const decks = await getDecks();
            if (!decks) {
                alert('Failed');
                return;
            }
            setDecks(decks);


            // Load Decks Graded
            const decksGraded = await getDecksGraded();
            if (!decksGraded) {
                alert('Failed');
                return;
            }
            setDecksGraded(decksGraded);
            

            // Load Word Accuracies
            const wordAccuracies = await getWordAccuracies(decksGraded);
            setWordAccuracies(wordAccuracies);
        }
        load();
    }, []);


    const onBookCreated = (book: BookType) => {
        if (!books)
            return;
        setBooks([...books, book]);
        setShowCreateBook(false);
    }


    const onDeckCreated = (deck: DeckType) => {
        if (!decks)
            return;
        setDecks([...decks, deck]);
        setShowCreateDeck(false);
    }


    const onDeleteDeck = async (deckID: number) => {
        if (!decks)
            return;
        
        const deletedDeck = await deleteDeck(deckID);
        if (!deletedDeck) {
            alert('Failed to Delete Deck');
            return;
        }
        setDecks(decks.filter(deck => deck.deck_id !== deckID));
    }

    
    if (!decks || !books) 
        return <></>;

    return (
        <div className="w-full h-full grid grid-cols-[0px_1fr] bg-black overflow-y-scroll">
            <div className="flex col-start-2">
                <section className="w-full px-4 py-4">
                    <h3 className="mb-4 text-lg text-white font-medium tracking-tight">
                        Decks
                    </h3>
                    <div className="flex flex-wrap gap-8">
                        <Button
                            label="Create Deck"
                            onClick={() => setShowCreateDeck(true)}
                        />
                        {decks.map((deck, i) => (
                            <Fragment key={i}>
                                <p 
                                    className="p-4 text-white bg-orange-500"
                                    onClick={() => router.push(`/deck?deckID=${deck.deck_id}`)}
                                >
                                    {deck.deck_name}, {deck.deck_chapters.length} Chapters
                                    <TrashIcon
                                        onClick={(event) => {
                                            event.preventDefault();
                                            event.stopPropagation();
                                            onDeleteDeck(deck.deck_id);
                                        }}
                                    />
                                </p>
                            </Fragment>
                        ))}
                    </div>
                </section>
                <section className="w-full px-4 py-4">
                    <h3 className="mb-4 text-lg text-white font-medium tracking-tight">
                        Books
                    </h3>
                    <div className="flex flex-wrap gap-8">
                        <Book
                            isCreateButton={true}
                            onClick={() => setShowCreateBook(true)}
                        />
                        {books.map((book, i) => (
                            <Fragment key={i}>
                                <Book
                                    book={book}
                                    onClick={() => router.push(`/book?bookID=${book.book_id}`)}
                                />
                            </Fragment>
                        ))}
                    </div>
                </section>
                {showCreateDeck &&
                    <CreateDeck
                        books={books}
                        onClose={() => setShowCreateDeck(false)}   
                        onDeckCreated={onDeckCreated}
                    />
                }
                {showCreateBook &&
                    <CreateBook
                        onClose={() => setShowCreateBook(false)}
                        onBookCreated={onBookCreated}
                    />
                }
            </div>
        </div>
    )
}