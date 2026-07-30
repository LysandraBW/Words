"use client";
import Logo from "../login/panel/Logo";
import { HomeIcon, SettingsIcon } from "lucide-react";
import SearchWords from "./SearchWords";
import { Fragment, useEffect, useState } from "react";
import loadData from "../home/loadData";
import getWordEntries, { Entry } from "@/services/words/getWordEntry";
import clsx from "clsx";
import { dynaPuffFont, glutenFont, snigletFont } from "../fonts";
import DraggableWord from "@/components/DraggableWord";
import { ReaderType, selectReader } from "@/services/server/reader";
import { useRouter } from "next/navigation";

export default function Layout({children}: {children: React.ReactNode}) {
    const router = useRouter();

    const [reader, setReader] = useState<ReaderType>();
    const [lookup, setLookup] = useState<{[word: string]: {entries: Entry[], z: number}}|null>();

    useEffect(() => {
        const load = async () => {
            const reader = await selectReader();
            if (!reader) {
                return router.push('/login');
            }
            setReader(reader[0]);
        }
        load();
    }, []);


    useEffect(() => {
        console.log('Reader Changed', reader);
    }, [reader]);


    const onOpenWord = async (word: string) => {
        let wordEntries = await getWordEntries(word);
        setLookup(showing => {
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
        setLookup(showing => {
            const updatedShowing = {...showing};
            delete updatedShowing[word];
            return updatedShowing;
        });
    }


    const onRaiseWord = (word: string) => {
        setLookup(lookup => {
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


    return (
        <div className="w-full h-full grid grid-cols-[256px_1fr] grid-rows-[72px_1fr]">
            <div className="col-start-1 col-span-1 row-start-1 row-span-1 flex justify-center items-center bg-neutral-900 border-r border-b border-neutral-800">
                <span className={clsx(snigletFont.className, "relative block text-3xl tracking-[-1px] text-neutral-700")}>
                    WORDS 
                </span>
            </div>
            <div className="col-start-2 col-span-2 row-start-1 row-span-1 p-4 bg-neutral-900 border-b border-neutral-800">
                <SearchWords
                    onOpenWord={onOpenWord}
                />
            </div>
            <div className="col-start-1 col-span-1 row-start-2 row-span-1 px-4 py-4  flex flex-col items-center gap-y-6- justify-between bg-neutral-900 border-r border-neutral-800">
                <div 
                    className="h-[156px] w-full bg-center bg-cover"
                    style={{
                        backgroundImage: `url(https://m.media-amazon.com/images/M/MV5BMjVjMzQ0MjEtYjFlNi00MDU5LTg1ZjMtMDA1NGEwYWMwNDYxXkEyXkFqcGc@._V1_.jpg)`
                    }}    
                >

                </div>
                <div className="w-full flex flex-col items-center gap-y-3">
                    <button className="w-full px-2 py-1 flex items-center gap-x-2 bg-neutral-800 border border-neutral-700 shadow rounded-md">
                        <HomeIcon
                            size={14}
                            className="stroke-neutral-400"
                        />
                        <span className="text-neutral-300 text-sm font-medium">
                            Home
                        </span>
                    </button>
                    <button className="w-full px-2 py-1 flex items-center gap-x-2 bg-neutral-950/50 rounded-md">
                        <SettingsIcon
                            size={14}
                            className="stroke-neutral-500"
                        />
                        <span className="text-neutral-500 text-sm font-medium">
                            Settings
                        </span>
                    </button>
                </div>
                <div className="w-full p-1- flex justify-center items-center gap-x-2 bg-neutral-950/50- border- border-neutral-800/75 shadow- rounded-xl- overflow-clip">            
                    {/* Profile Picture */}
                    <div className="p-[2px] border border-neutral-600 bg-neutral-800 rounded-[10px] shadow">
                        <div 
                            className="aspect-square h-[56px] bg-center bg-cover border- border-neutral-600 rounded-lg"
                            style={{
                                backgroundImage: `url(https://m.media-amazon.com/images/S/pv-target-images/5620550b7170b1c281665e148fca399e353c95a68f63195d3c1fa887b8c9dd5d.jpg)`
                            }}
                        >
                            
                        </div>
                    </div>
                    {/* Account Details */}
                    <div className="hidden w-full flex flex-col gap-y-0 overflow-hidden">
                        <div className="block flex flex-col -space-y-0.5">
                            <span 
                                className={clsx(
                                    "block text-taupe-500 text-sm tracking-wide- font-medium max-w-xs letter-break overflow-hidden text-ellipsis",
                                    // scri
                                )}
                            >
                                John Smith
                                {/* {reader?.reader_name} */}
                            </span>
                        </div>
                        {/* <div className="flex items-center gap-x-2">
                            <span className="block text-neutral-500/50 text-sm font-medium- whitespace-nowrap max-w-full overflow-hidden text-ellipsis lowercase">
                                {reader?.reader_email}
                            </span>
                        </div> */}
                    </div>
                </div>
            </div>
            <div className="col-start-2 col-span-1 row-start-2 row-span-1 bg-neutral-950">
                {children}
            </div>
            {lookup && Object.entries(lookup).map(([word, wordLookupInfo]) => (
                <Fragment key={word}>
                    <DraggableWord
                        word={word}
                        entries={wordLookupInfo.entries}
                        zIndex={wordLookupInfo.z}
                        onOpenWord={onOpenWord}
                        onCloseWord={onCloseWord}
                        onRaiseWord={onRaiseWord}
                    />
                </Fragment>
            ))}
        </div>
    )
}