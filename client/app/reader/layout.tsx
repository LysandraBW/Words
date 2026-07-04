"use client";
import Logo from "@/components/Logo";
import { SettingsIcon } from "lucide-react";
import SearchWords from "./SearchWords";
import { useState } from "react";
import loadData from "../home/loadData";
import getWordEntries, { Entry } from "@/services/words/getWordEntry";

export default function Layout({children}: {children: React.ReactNode}) {
    const [lookup, setLookup] = useState<{[word: string]: {entries: Entry[], z: number}}|null>();

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
        <div className="w-full h-full grid grid-cols-[196px_1fr] grid-rows-[72px_1fr]">
            <div className="col-start-1 col-span-1 row-start-1 row-span-1 bg-neutral-900 border-r border-b border-neutral-800">
            </div>
            <div className="col-start-2 col-span-2 row-start-1 row-span-1 p-4 bg-neutral-900 border-b border-neutral-800">
                <SearchWords
                    onOpenWord={onOpenWord}
                />
            </div>
            <div className="col-start-1 col-span-1 row-start-2 row-span-1 p-4 flex flex-col items-center gap-y-4 justify-end bg-neutral-900 border-r border-neutral-800">
                {/* Profile Picture */}
                <div className="w-[72px] aspect-square bg-neutral-800 rounded-full border border-neutral-700 shadow-sm">
                </div>
                {/* Account Details */}
                <div className="h-[48px] w-full bg-neutral-800 rounded-lg border border-neutral-700 shadow-sm">
                </div>
            </div>
            <div className="col-start-2 col-span-1 row-start-2 row-span-1 bg-neutral-950">
                {children}
            </div>
        </div>
    )
}