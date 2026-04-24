"use client";
import { BookType, getBook, getBookChapters } from "@/services/db/books";
import { ChapterType } from "@/services/db/chapter";
import { getReader, ReaderType } from "@/services/db/reader";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"
import ModifyChapters from "./ModifyChapter";

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

            // Get Book by Book ID
            const book = await getBook(bookID);
            if (!book?.length)
                return;
            setBook(book[0]);

            const bookChapters = await getBookChapters(bookID);
            setBookChapters(bookChapters || []);

            console.log(book);
            console.log(bookChapters);
        }
        load();
    }, []);


    return (
        <div>
            {JSON.stringify(book)}
            {JSON.stringify(bookChapters)}
            <div className="bg-gray-50">
                <ModifyChapters 
                    onClose={() => null}
                    chapters={bookChapters || []}
                    onUpdate={(c: any) => null}
                    onDelete={(c: any) => null}
                    onCreate={(c: any) => null}
                />
            </div>
        </div>
    )
}