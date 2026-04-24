"use client";
import { BookType, getBook, getBookChapters } from "@/services/db/books";
import { ChapterType } from "@/services/db/chapter";
import { getReader, ReaderType } from "@/services/db/reader";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"
import UpdateChapters from "./UpdateChapter";
import UpdateBook from "./UpdateBook";

export default function Page() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [user, setUser] = useState<ReaderType>();
    const [book, setBook] = useState<BookType>();
    const [bookChapters, setBookChapters] = useState<ChapterType[]>();


    useEffect(() => {
        const load = async () => {
            // User
            const user = await getReader();
            if (!user)
                return router.push('/signIn');
            setUser(user);

            // Book ID
            const bookID = searchParams.get("bookID");
            if (bookID === null)
                return router.push('/home');

            // Get Book by ID
            const book = await getBook(bookID);
            if (!book?.length)
                return;
            setBook(book[0]);

            // Get Book's Chapters
            const bookChapters = await getBookChapters(bookID);
            setBookChapters(bookChapters || []);
        }
        load();
    }, []);


    return (
        <div>
            {/* {JSON.stringify(book)} */}
            {/* {JSON.stringify(bookChapters)} */}
            <div className="bg-red-500">
                {(book && bookChapters) &&
                    <UpdateChapters 
                        onClose={() => null}
                        book={book}
                        chapters={bookChapters}
                    />
                }
            </div>
            <div className="bg-blue-500">
                {book &&
                    <UpdateBook
                        book={book}
                        onClose={() => 0}
                        onUpdate={(book: BookType) => 0}
                    />
                }
            </div>
        </div>
    )
}