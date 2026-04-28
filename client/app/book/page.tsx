"use client";
import { BookType, getBook, getBookChapters } from "@/services/db/book";
import { ChapterType } from "@/services/db/chapter";
import { getReader, ReaderType } from "@/services/db/reader";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"
import UpdateChapters from "./UpdateChapters";
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
            const numberBookID = Number(bookID);

            // Get Book by ID
            const book = await getBook(numberBookID);
            if (!book)
                return;
            setBook(book);

            // Get Book's Chapters
            const bookChapters = await getBookChapters(numberBookID);
            setBookChapters(bookChapters || []);
        }
        load();
    }, []);


    return (
        <div>
            {/* {JSON.stringify(book)} */}
            {/* {JSON.stringify(bookChapters)} */}
            {bookChapters && bookChapters.map((chapter, i) => (
                <div 
                    key={i}
                    onClick={() => router.push(`/chapter?chapterID=${chapter.chapter_id}`)}
                >
                    {chapter.chapter_id}, {chapter.chapter_number}, {chapter.chapter_title}
                </div>
            ))}
            <div className="bg-red-500">
                {(book && bookChapters) &&
                    <UpdateChapters
                        book={book}
                        chapters={bookChapters}
                        onChaptersUpdated={(chapters: ChapterType[]) => 0}
                        onClose={() => 0}
                    />
                }
            </div>
            <div className="bg-blue-500">
                {book &&
                    <UpdateBook
                        book={book}
                        onBookUpdated={(book: BookType) => 0}
                        onClose={() => 0}
                    />
                }
            </div>
        </div>
    )
}