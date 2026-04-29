"use client";
import { BookType } from "@/services/server/book";
import { ChapterType } from "@/services/server/chapter";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"
import UpdateChapters from "./UpdateChapters";
import UpdateBook from "./UpdateBook";
import loadData from "./loadData";
import ShowWords from "@/components/ShowWords";
import ShowChapters from "./ShowChapters";


export default function Page() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const bookID = searchParams.get("bookID");
    if (!bookID)
        return router.push('/home');

    const [data, setData] = useState<Awaited<ReturnType<typeof loadData>>>();
    const [show, setShow] = useState<string>('');


    useEffect(() => {
        const load = async () => {
            try {
                const data = await loadData(Number(bookID));
                setData(data);
            }
            catch (err) {
                alert(err);
            }
        }
        load();
    }, []);


    const handleBookUpdated = (book: BookType) => {
        setData(data => {
            if (!data)
                return data;
            return {
                ...data,
                book
            }
        });
    }


    const handleChaptersUpdated = (chapters: ChapterType[]) => {
        setData(data => {
            if (!data)
                return data;
            return {
                ...data,
                chapters
            }
        });
    }


    if (!data)
        return <></>;


    return (
        <div>
            <ShowWords
                words={data.words}
                decksGraded={data.decksGraded}
            />
            <ShowChapters
                chapters={data.chapters}
            />
            <div className="bg-red-500">
                <UpdateChapters
                    book={data.book}
                    chapters={data.chapters}
                    onChaptersUpdated={handleChaptersUpdated}
                    onClose={() => setShow('')}
                />
            </div>
            <div className="bg-blue-500">
                <UpdateBook
                    book={data.book}
                    onBookUpdated={handleBookUpdated}
                    onClose={() => setShow('')}
                />
            </div>
        </div>
    )
}