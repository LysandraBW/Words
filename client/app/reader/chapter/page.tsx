"use client";
import loadData, { useDataHandlers } from "@/app/chapter/loadData";
import { deleteChapter } from "@/services/server/chapter";
import { insertWord, decrementWordNumberInstances as decrementWord, deleteWord, incrementWordNumberInstances as incrementWord } from "@/services/server/word";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import BookScene from "../book/BookScene2";
import { ChevronRightIcon, EllipsisIcon, TrashIcon } from "lucide-react";
import WordTab from "../WordTab";
import getWordEntries, { Entry } from "@/services/words/getWordEntry";
import UpdateChapter from "./UpdateChapter";
import LogWord from "./LogWord";

export default function Page() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const chapterID = searchParams.get("chapterID");
    if (!chapterID)
        return router.push('/home');

    const [data, setData] = useState<Awaited<ReturnType<typeof loadData>>>();
    const handlers = useDataHandlers(setData);
    
    const [show, setShow] = useState<string>('Log Word');

    const [wordLookup, setWordLookup] = useState<{[word: string]: {entries: Entry[], z: number}}|null>();

    useEffect(() => {
        const load = async () => {
            try {
                const data = await loadData(Number(chapterID));
                setData(data);
            }
            catch (err) {
                alert(err);
            }
        }
        load();
    }, []);
    

    const onDeleteChapter = async (chapterID: number) => {
        try {
            await deleteChapter(chapterID);
            router.back();
        }
        catch (err) {
            alert(err);
        }
    }


    const onCreateWord = async (word: string, wordDefinition: string) => {
        try {
            const createdWord = await insertWord({word: [word, wordDefinition]});
            handlers.handleWordCreated(createdWord);
        }
        catch (err) {
            alert(err);
        }
    }  


    const onDeleteWord = async (wordID: number) => {
        try {
            const deletedWord = await deleteWord(wordID);
            handlers.handleWordDeleted(deletedWord);
        }
        catch (err) {
            alert(err);
        }
    }


    const onIncrementWord = async (wordID: number) => {
        try {
            const updatedWord = await incrementWord(wordID);
            handlers.handleWordIncremented(updatedWord);
        }
        catch (err) {
            alert(err);
        }
    }


    const onDecrementWord = async (wordID: number) => {
        try {
            const updatedWord = await decrementWord(wordID);
            handlers.handleWordDecremented(updatedWord);
        }
        catch (err) {
            alert(err);
        }
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
        return <>Loading</>;

    return (
        <>
            <div className="grid grid-cols-1 grid-rows-[auto_auto_1fr]">
                {/* Book Picture */}
                <div className="relative z-10 p-2">
                    <div 
                        className="relative h-[156px] grid grid-cols-[auto_1fr] bg-cover bg-center bg-no-repeat border border-neutral-800 rounded-lg overflow-clip"
                        style={{
                            backgroundImage: `url(${data?.chapter.book_background_image})`
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
                                    coverImage={`https://images.weserv.nl/?url=${encodeURIComponent((data?.chapter.book_cover_image || "").replace(/^https?:\/\//, ''))}`}
                                />
                            </div>
                            <div className="grid grid-rows-[1fr_auto_1fr] grid-cols-1 gap-y-0">
                                <div className="row-start-2 row-span-1 relative flex flex-col -space-y-1">
                                    <p className="block text-base font-medium- text-neutral-400">
                                        {data?.chapter.book_author}'s
                                    </p>
                                    <p className="block text-base font-medium text-neutral-100 max-w-xs">
                                        {data?.chapter.book_name}
                                    </p>
                                    <div className="h-min flex items-center gap-x-1">
                                        <ChevronRightIcon
                                            size={14}
                                            strokeWidth={3}
                                            className="relative top-[1.5px] stroke-yellow-400"
                                        />
                                        <p className="mt-0.5 row-start-3 row-span-1 font-medium text-xl text-neutral-100 text-shadow-sm">
                                            Chapter {data?.chapter.chapter_number}: Introduction
                                        </p>
                                    </div>
                                </div>
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
                <div className="p-2 bg-neutral-950 grid grid-rows-[auto_1fr] grid-cols-1 gap-y-2 overflow-auto border-t border-t-neutral-800">
                    <WordTab
                        words={data?.words || []}
                        decksGraded={data?.decksGraded || []}
                        onOpenWord={onOpenWord}
                        onCloseWord={onCloseWord}
                        onBringWordToFront={onBringWordToFront}
                        lookup={wordLookup || null}
                        setLookup={setWordLookup}
                        onCreate={() => setShow('Log Word')}
                    />
                </div>
            </div>
            {show === 'Update Chapter' &&
                <div className="">
                    <UpdateChapter
                        chapter={data?.chapter}
                        onClose={() => setShow('')}
                        onChapterUpdated={() => 1}
                    />
                </div>
            }
            {show === 'Log Word' &&
                <div className="">
                    <LogWord
                        book={data?.chapter}
                        chapter={data?.chapter}
                        books={data?.books}
                        chapters={data?.chapters}
                        onClose={() => setShow('')}
                    />
                </div>
            }
        </>
    );
}