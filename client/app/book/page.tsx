"use client";
import { BookType, selectBook, selectBookChapters, selectBookWords } from "@/services/server/book";
import { ChapterType } from "@/services/server/chapter";
import { selectReader, ReaderType } from "@/services/server/reader";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { Fragment, useEffect, useState } from "react"
import UpdateChapters from "./UpdateChapters";
import UpdateBook from "./UpdateBook";
import { WordType } from "@/services/server/word";
import useSortWords from "@/hooks/useSortWords";
import { selectDecksGradedByBook } from "@/services/server/deckGraded";
import getWordData from "@/utilities/wordData";
import InputDropdown from "@/components/input/InputDropdown";

export default function Page() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [user, setUser] = useState<ReaderType>();
    const [book, setBook] = useState<BookType>();
    
    const [words, setWords] = useState<WordType[]>();
    const [wordAccuracies, setWordAccuracies] = useState<{[word: string]: number}>();
    const sortWords = useSortWords(words);

    const [chapters, setChapters] = useState<ChapterType[]>();


    useEffect(() => {
        const load = async () => {
            // User
            const user = await selectReader();
            if (!user)
                return router.push('/signIn');
            setUser(user);

            // Book ID
            const bookID = searchParams.get("bookID");
            if (bookID === null)
                return router.push('/home');
            const numberBookID = Number(bookID);

            // Get Book by ID
            const book = await selectBook(numberBookID);
            if (!book) {
                alert('Failed');
                return;
            }
            setBook(book);

            // Get Book's Chapters
            const chapters = await selectBookChapters(numberBookID);
            if (!chapters) {
                alert('Failed');
                return;
            }
            setChapters(chapters);

            // Load Decks Graded
            const decksGraded = await selectDecksGradedByBook(book.book_id);
            if (!decksGraded) {
                alert('Failed');
                return;
            }

            // Get Book's Words
            const words = await selectBookWords(numberBookID);
            if (!words) {
                alert('Failed');
                return;
            }
            setWords(words);

            // Load Word Accuracies
            const wordAccuracies = await getWordData(decksGraded, words.map(word => word.word[0]));
            setWordAccuracies(wordAccuracies);
        }
        load();
    }, []);


    if (!book || !chapters || !words || !wordAccuracies)
        return <></>;

    return (
        <div>
            <section className="w-full px-4 py-4">
                <h3 className="mb-4 text-lg text-white font-medium tracking-tight">
                    Words
                </h3>
                <div className="flex flex-wrap gap-8">
                    <InputDropdown
                        label="Sort Words"
                        options={sortWords.sortOptions}
                        value={[sortWords.sort]}
                        onChange={(value: string) => sortWords.setSort(value)}
                    />
                    <div>
                        {words.map((word, i) => (
                            <Fragment key={i}>
                                <p 
                                    className="p-4 text-white bg-pink-500"
                                >
                                    {word.word[0]}, {word.word_number_instances}, {word.created_at || 'Null'}, {word.last_seen || 'Null'}, {wordAccuracies[word.word[0]]}
                                </p>
                            </Fragment>
                        ))}
                    </div>
                </div>
            </section>
            {chapters.map((chapter, i) => (
                <div 
                    key={i}
                    onClick={() => router.push(`/chapter?chapterID=${chapter.chapter_id}`)}
                >
                    {chapter.chapter_id}, {chapter.chapter_number}, {chapter.chapter_title}
                </div>
            ))}
            <div className="bg-red-500">
                <UpdateChapters
                    book={book}
                    chapters={chapters}
                    onChaptersUpdated={(chapters: ChapterType[]) => setChapters(chapters)}
                    onClose={() => 0}
                />
            </div>
            <div className="bg-blue-500">
                <UpdateBook
                    book={book}
                    onBookUpdated={(book: BookType) => setBook(book)}
                    onClose={() => 0}
                />
            </div>
        </div>
    )
}