"use client";
import { BookType, getBooks } from "@/services/db/book";
import { getReader, ReaderType } from "@/services/db/reader";
import { useRouter } from "next/navigation";
import { Fragment, useEffect, useState } from "react"
import CreateBook from "./CreateBook";
import Book from "./Book";
import NavBar from "@/components/NavBar";
import CreateDeck from "./CreateDeck";
import { DeckType, getDecks } from "@/services/db/deck";
import Button from "@/components/Button";

export default function Page() {
    const router = useRouter();
    const [user, setUser] = useState<ReaderType>();
    const [books, setBooks] = useState<Array<BookType>>([]);
    const [decks, setDecks] = useState<Array<DeckType>>([]);
    const [showCreateDeck, setShowCreateDeck] = useState(true);
    const [showCreateBook, setShowCreateBook] = useState(false);


    useEffect(() => {
        const load = async () => {
            const user = await getReader();
            if (!user)
                return router.push('/signIn');
            setUser(user);

            const books = await getBooks();
            if (books)
                setBooks(books);

            const decks = await getDecks();
            console.log('decks', decks);
            if (decks)
                setDecks(decks);
        }
        load();
    }, []);


    const onBookCreated = (book: BookType) => {
        setBooks([...books, book]);
        setShowCreateBook(false);
    }


    const onDeckCreated = (deck: DeckType) => {
        setDecks([...decks, deck]);
        setShowCreateDeck(false);
    }


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