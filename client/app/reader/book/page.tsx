"use client";
import loadData from "@/app/reader/book/loadData";
import { BookType } from "@/services/server/book";
import { ChapterType } from "@/services/server/chapter";
import { BookIcon, EllipsisIcon, TextInitialIcon, TrashIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import ChapterTab from "../ChapterTab";
import WordTab from "../WordTab";
import getWordEntries, { Entry } from "@/services/words/getWordEntry";
import BookScene from "./BookScene";
import UpdateChapters from "@/app/reader/book/UpdateChapters";
import UpdateBook from "@/app/reader/book/UpdateBook";
import AddChapter from "./CreateChapter";
import Tab from "../home/Tab";
import IconButton from "@/components/ui/IconButton";
import CreateWord from "../chapter/CreateWord";

export default function Page() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const bookID = searchParams.get("bookID");
    if (!bookID)
        return router.push('/home');

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
                <div className="relative z-10 p-2">
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
                            <IconButton
                                Icon={EllipsisIcon}
                                onClick={() => setShow('Update Book')}
                                className="!bg-neutral-100/10 !backdrop-blur-sm !border-neutral-400/30 !shadow-xs"
                            />
                            <IconButton
                                Icon={TrashIcon}
                                onClick={() => null}
                                className="!bg-neutral-100/10 !backdrop-blur-sm !border-neutral-400/30 !shadow-xs"
                            />
                        </div>
                    </div>
                </div>
                <div className="w-full p-2 grid grid-cols-2 gap-x-2 bg-neutral-900 border-y border-neutral-800">
                    <Tab
                        TabIcon={BookIcon}
                        tabLabel="Chapters"
                        selected={tabIndex === 0}
                        onClick={() => setTabIndex(0)}
                    />
                    <Tab
                        TabIcon={TextInitialIcon}
                        tabLabel="Words"
                        selected={tabIndex === 1}
                        onClick={() => setTabIndex(1)}
                    />
                </div>
                <div className="p-2 bg-neutral-950 grid grid-rows-[auto_1fr] grid-cols-1 gap-y-2 overflow-auto">
                    {tabIndex === 0 &&
                        <ChapterTab
                            chapters={chapters}
                            onCreate={() => setShow('Add Chapter')}
                            onDelete={() => null}
                            showBook={false}
                        />
                    }
                    {tabIndex === 1 &&
                        <WordTab
                            words={data?.words || []}
                            decksGraded={data?.decksGraded || []}
                            lookup={wordLookup || null}
                            onOpenWord={onOpenWord}
                            onCloseWord={onCloseWord}
                            onBringWordToFront={onBringWordToFront}
                            setLookup={setWordLookup}
                            onCreate={() => setShow('Create Word')}
                            onDelete={() => null}
                        />
                    }
                </div>
            </div>
            {show === 'Update Chapters' &&
                <UpdateChapters
                    book={data.book}
                    chapters={data.chapters}
                    onChaptersUpdated={handleChaptersUpdated}
                    onClose={() => setShow('')}
                />
            }
            {show === 'Update Book' &&
                <UpdateBook
                    book={data.book}
                    onBookUpdated={handleBookUpdated}
                    chapters={data.chapters}
                    onChaptersUpdated={handleChaptersUpdated}
                    onClose={() => setShow('')}
                />
            }
            {show === 'Add Chapter' &&
                <AddChapter
                    onClose={() => setShow('')}
                />
            }
            {show === 'Create Word' &&
                <CreateWord
                    book={data.book}
                    books={data?.books || []}
                    chapters={data?.chapters || []}
                    onClose={() => setShow('')}
                    requireBookAndChapter
                />
            }
        </>
    )
}