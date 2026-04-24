"use client";
import { BookType, getBooks } from "@/services/db/books";
import { getReader, ReaderType } from "@/services/db/reader";
import { useRouter } from "next/navigation";
import { Fragment, useEffect, useState } from "react"
import CreateBook from "./CreateBook";
import Book from "./Book";
import NavBar from "@/components/NavBar";

export default function Page() {
    const router = useRouter();
    const [user, setUser] = useState<ReaderType>();
    const [books, setBooks] = useState<Array<BookType>>([]);
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
        }
        load();
    }, []);

    const onBookCreated = (book: BookType) => {
        setBooks([...books, book]);
        setShowCreateBook(false);
    }

    return (
        <div className="w-full h-full grid grid-cols-[256px_1fr] bg-black overflow-y-scroll">
            {/* <NavBar/> */}
            <div className="flex col-start-2">
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
                                    onClick={() => router.push(`/books?bookID=${book.book_id}`)}
                                />
                            </Fragment>
                        ))}
                    </div>
                </section>
                {showCreateBook &&
                    <CreateBook
                        onClose={() => setShowCreateBook(false)}
                        onCreate={onBookCreated}
                    />
                }
            </div>
        </div>
    )
}