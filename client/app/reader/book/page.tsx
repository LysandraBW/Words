"use client";
import loadData from "@/app/book/loadData";
import { BookType } from "@/services/server/book";
import { ChapterType } from "@/services/server/chapter";
import clsx from "clsx";
import { BookIcon, CaseUpperIcon, DeleteIcon, EllipseIcon, EllipsisIcon, TextInitialIcon, TrashIcon, WholeWordIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import BookTab from "../BookTab";
import ChapterTab from "../ChapterTab";
import WordTab from "../WordTab";
import DeckTab from "../DeckTab";
import getWordEntries, { Entry } from "@/services/words/getWordEntry";
import BookScene from "./BookScene2";
import UpdateChapters from "@/app/book/UpdateChapters";
import UpdateBook from "@/app/book/UpdateBook";
import Modal from "@/components/Modal";
import InputText from "@/components/input/InputText";
import InputButton from "@/components/input/InputButton";
import AddChapter from "./AddChapter";

export default function Page() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const bookID = searchParams.get("bookID");
    if (!bookID)
        return router.push('/home');

    
    const tabs = ["Chapters", "Words"];
    const [tabIndex, setTabIndex] = useState(0);

    const [data, setData] = useState<Awaited<ReturnType<typeof loadData>>>();
    const [show, setShow] = useState<string>('');

    const [wordLookup, setWordLookup] = useState<{[word: string]: {entries: Entry[], z: number}}|null>();
    
    const chapters: (BookType & ChapterType)[] = !data?.book ? [] : (data?.chapters || []).map((chapter) => {
        return {
            ...data.book,
            ...chapter
        }
    });

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


    const onOpenWord = async (word: string) => {
        let wordEntries = await getWordEntries(word);
        setWordLookup(showing => {
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
        setWordLookup(showing => {
            const updatedShowing = {...showing};
            delete updatedShowing[word];
            return updatedShowing;
        });
    }


    const onBringWordToFront = (word: string) => {
        setWordLookup(lookup => {
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
        return <></>;

    return (
        <>
            <div className="grid grid-cols-1 grid-rows-[auto_auto_1fr]">
                {/* Book Picture */}
                <div className="relative z-10 p-4">
                    <div 
                        className="relative h-[156px] grid grid-cols-[auto_1fr] bg-cover bg-center bg-no-repeat border border-neutral-800 rounded-lg overflow-clip"
                        style={{
                            backgroundImage: `url(${data?.book.book_background_image})`
                        }}
                    >
                        <div className="absolute z-0 left-0 top-0 w-full h-full bg-linear-to-r from-black/50 to-black/0">

                        </div>
                        {/* Band 1 */}
                        <div 
                            className="absolute z-10 left-0 top-0 w-[200px] h-full backdrop-blur-3xl"
                            style={{ 
                                WebkitMaskImage: 'linear-gradient(to right, black 40%, transparent 100%)',
                                maskImage: 'linear-gradient(to right, black 40%, transparent 100%)'
                            }}
                        />
                        {/* Band 2 */}
                        <div 
                            className="absolute z-10 left-[80px] top-0 w-[200px] h-full backdrop-blur-2xl"
                            style={{ 
                                WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 30%, black 60%, transparent 100%)',
                                maskImage: 'linear-gradient(to right, transparent 0%, black 30%, black 60%, transparent 100%)'
                            }}
                        />
                        {/* Band 3 */}
                        <div 
                            className="absolute z-10 left-[160px] top-0 w-[200px] h-full backdrop-blur-xl"
                            style={{ 
                                WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 30%, black 60%, transparent 100%)',
                                maskImage: 'linear-gradient(to right, transparent 0%, black 30%, black 60%, transparent 100%)'
                            }}
                        />
                        {/* Band 4 */}
                        <div 
                            className="absolute z-10 left-[240px] top-0 w-[200px] h-full backdrop-blur-lg"
                            style={{ 
                                WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 30%, black 60%, transparent 100%)',
                                maskImage: 'linear-gradient(to right, transparent 0%, black 30%, black 60%, transparent 100%)'
                            }}
                        />
                        {/* Band 5 */}
                        <div 
                            className="absolute z-10 left-[320px] top-0 w-[200px] h-full backdrop-blur-md"
                            style={{ 
                                WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 30%, black 60%, transparent 100%)',
                                maskImage: 'linear-gradient(to right, transparent 0%, black 30%, black 60%, transparent 100%)'
                            }}
                        />
                        {/* Band 6 */}
                        <div 
                            className="absolute z-10 left-[400px] top-0 w-[350px] h-full backdrop-blur-sm"
                            style={{ 
                                WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 20%, black 40%, transparent 100%)',
                                maskImage: 'linear-gradient(to right, transparent 0%, black 20%, black 40%, transparent 100%)'
                            }}
                        />
                        <div className="relative z-50 grid grid-cols-[auto_auto] items-center gap-x-2">
                            <div className="max-h-[156px]">
                                <BookScene
                                    coverImage={`https://images.weserv.nl/?url=${encodeURIComponent((data?.book.book_cover_image || "").replace(/^https?:\/\//, ''))}`}
                                />
                            </div>
                            <div className="flex flex-col -space-y-1">
                                <p className="block text-base font-medium- text-neutral-400">
                                    {data?.book.book_author}'s
                                </p>
                                <p className="block text-xl font-medium text-neutral-100 max-w-xs text-shadow-sm">
                                    {data?.book.book_name}
                                </p>
                            </div>
                        </div>
                        <div className="p-2 flex gap-x-2 justify-end">
                            <button className="p-1 w-[26px] h-[26px] flex justify-center items-center bg-neutral-100/10 backdrop-blur-sm border border-neutral-400/30 rounded-lg shadow-xs">
                                <EllipsisIcon
                                    size={14}
                                    strokeWidth={1.5}
                                    className="stroke-neutral-500"
                                />
                            </button>
                            <button className="p-1 w-[26px] h-[26px] flex justify-center items-center bg-neutral-100/10 backdrop-blur-sm border border-neutral-400/30 rounded-lg shadow-xs">
                                <TrashIcon
                                    size={14}
                                    strokeWidth={1.5}
                                    className="stroke-neutral-500"
                                />
                            </button>
                        </div>
                    </div>
                </div>
                {/* Tabs */}
                <div className="w-full p-2 grid grid-cols-2 gap-x-2 bg-neutral-900 border-y border-neutral-800">
                    {tabs.map((tab, i) => (
                        <div 
                            key={i}
                            onClick={() => setTabIndex(i)}
                            className={clsx(
                                "py-1 px-2 flex justify-center items-center gap-x-2 border border-transparent rounded-md text-sm text-neutral-500 font-medium",
                                i !== tabIndex && "bg-neutral-950/50 cursor-pointer hover:bg-neutral-950/75 hover:scale-97 transition-all",
                                i === tabIndex && "bg-blue-600 !border-blue-500 shadow-md !text-neutral-200"
                            )}
                        >
                        {tab === "Chapters" &&
                                <BookIcon
                                    size={16}
                                    strokeWidth={1.5}
                                />
                            }
                            {tab === "Words" &&
                                <TextInitialIcon
                                    size={16}
                                    strokeWidth={1.5}
                                    className="relative top-[1px]"
                                />
                            }
                            {tab}
                        </div>
                    ))}
                </div>
                <div className="p-2 bg-neutral-950 grid grid-rows-[auto_1fr] grid-cols-1 gap-y-2 overflow-auto">
                    {tabIndex === 0 &&
                        <ChapterTab
                            chapters={chapters}
                            onCreate={() => null}
                            showBook={false}
                        />
                    }
                    {tabIndex === 1 &&
                        <WordTab
                            words={data?.words || []}
                            decksGraded={data?.decksGraded || []}
                            onOpenWord={onOpenWord}
                            onCloseWord={onCloseWord}
                            onBringWordToFront={onBringWordToFront}
                            lookup={wordLookup || null}
                            setLookup={setWordLookup}
                        />
                    }
                </div>
            </div>
            {show === 'Update Chapters' &&
                <div className="bg-red-500">
                    <UpdateChapters
                        book={data.book}
                        chapters={data.chapters}
                        onChaptersUpdated={handleChaptersUpdated}
                        onClose={() => setShow('')}
                    />
                </div>
            }
            {show === 'Update Book' &&
                <div className="bg-blue-500">
                    <UpdateBook
                        book={data.book}
                        onBookUpdated={handleBookUpdated}
                        onClose={() => setShow('')}
                    />
                </div>
            }
            {show === 'Add Chapter' &&
                <AddChapter
                    onClose={() => setShow('')}
                />
            }
        </>
    )
}