"use client";
import loadData from "@/app/book/loadData";
import { BookType } from "@/services/server/book";
import { ChapterType } from "@/services/server/chapter";
import clsx from "clsx";
import { BookIcon, CaseUpperIcon, DeleteIcon, EllipseIcon, EllipsisIcon, TrashIcon, WholeWordIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import BookTab from "../BookTab";
import ChapterTab from "../ChapterTab";
import WordTab from "../WordTab";
import DeckTab from "../DeckTab";
import getWordEntries, { Entry } from "@/services/words/getWordEntry";

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
        <div className="">
            {/* Book Picture */}
            <div
                className="bg-cover bg-center bg-no-repeat isolate "
                style={{
                    backgroundImage: `url(${data?.book.book_background_image})`
                }}
            >
                <div className="relative z-10 p-2 bg-gradient-to-t from-neutral-950/75 to-neutral-950/90 backdrop-blur-3xl">
                    <div className="p-[1px] bg-gradient-to-b from-white/30 to-white/15 rounded-xl">
                        <div 
                            className="relative h-[200px] grid grid-cols-[auto_1fr] bg-cover bg-center bg-no-repeat rounded-xl overflow-clip"
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
                            <div className="relative z-50 p-4 grid grid-cols-[auto_auto] items-center gap-x-4">
                                <div 
                                    className="w-[112px] h-full bg-cover bg-center bg-no-repeat bg-black border border-neutral-800 rounded-r-2xl rounded-l-- shadow-md"
                                    style={{
                                        backgroundImage: `url(${data?.book.book_cover_image})`
                                    }}
                                >
                                </div>
                                <div className="flex flex-col -space-y-1">
                                    <p className="block text-lg font-medium text-neutral-300">
                                        {data?.book.book_author}'s
                                    </p>
                                    <p className="block text-2xl font-semibold text-neutral-100 max-w-xs text-shadow-sm">
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
                </div>
            </div>
            {/* Tabs */}
            <div className="w-full p-2 grid grid-cols-2 gap-x-2 bg-neutral-900/50 border-y border-neutral-800">
                {tabs.map((tab, i) => (
                    <div 
                        key={i}
                        onClick={() => setTabIndex(i)}
                        className={clsx(
                            "py-1 px-2 flex justify-center items-center gap-x-2 border border-transparent rounded-lg text-sm text-neutral-500/75",
                            i !== tabIndex && "cursor-pointer hover:bg-neutral-800 hover:scale-97",
                            i === tabIndex && "bg-neutral-700 !border-neutral-600 shadow-md !text-neutral-200"
                        )}
                    >
                        <p
                            className={clsx(
                                "flex items-center gap-x-2 text-xs text-neutral-500/75 tracking-wide rounded-md",
                                i !== tabIndex && "cursor-pointer hover:bg-white/10 hover:scale-97 transition-all",
                                i === tabIndex && "!text-neutral-200 font-medium"
                            )}
                        >
                            {tab === "Chapters" &&
                                <BookIcon
                                    size={12}
                                    strokeWidth={1.5}
                                />
                            }
                            {tab === "Words" &&
                                <CaseUpperIcon
                                    size={14}
                                    strokeWidth={1.5}
                                    className="relative top-[1px]"
                                />
                            }
                            {tab}
                        </p>
                        
                    </div>
                ))}
            </div>
            <div className="p-2">
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
    )
}