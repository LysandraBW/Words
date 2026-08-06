"use client";
import { ArrowLeftFromLineIcon , ChevronsLeftIcon, ChevronsRightIcon, HomeIcon, LogOutIcon, PanelLeftCloseIcon, SettingsIcon } from "lucide-react";
import SearchWords from "./SearchWords";
import { Fragment, useEffect, useState } from "react";
import loadData from "./home/loadData";
import getWordEntries, { Entry } from "@/services/words/getWordEntry";
import clsx from "clsx";
import { dynaPuffFont, glutenFont, snigletFont } from "../fonts";
import DraggableWord from "@/components/DraggableWord";
import { ReaderType, selectReader } from "@/services/server/reader";
import { useRouter } from "next/navigation";
import { Tooltip } from 'react-tooltip'
import Logo from "@/components/Logo";
import ProfilePicture from "@/components/ProfilePicture";
import ProfileToolKit from "@/components/ProfileToolKit";
import { usePathname, useSearchParams } from "next/navigation";
import NavBarTab from "./NavBarTab";


export default function Layout({children}: {children: React.ReactNode}) {
    const router = useRouter();
    const pathname = usePathname();

    const [reader, setReader] = useState<ReaderType>();
    const [lookup, setLookup] = useState<{[word: string]: {entries: Entry[], z: number}}|null>();
    const [page, setPage] = useState("");
    const [collapse, setCollapse] = useState(false);
    
    useEffect(() => {
        const load = async () => {
            const reader = await selectReader();
            if (!reader) {
                return router.push('/login');
            }
            setReader(reader[0]);
        }
        load();

        const page = pathname.split("/")[2];
        setPage(page);
    }, []);


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
        <div 
            className={clsx(
                "w-full h-screen max-h-screen grid grid-cols-[256px_1fr] grid-rows-[72px_minmax(0,1fr)]",
                collapse && "!grid-cols-[min-content_1fr]"
            )}
        >
            <div className="col-start-1 col-span-1 row-start-1 row-span-1 px-4 flex justify-between items-center bg-neutral-900 border-r border-b border-neutral-800">
                <div 
                    className={clsx(
                        "flex gap-x-2 items-center",
                        collapse && "w-full h-full justify-center"
                    )}
                >
                    <Logo/>
                    {!collapse &&
                        <span className={clsx(snigletFont.className, "relative block text-2xl tracking-[-1px] text-blue-100")}>
                            WORDS
                        </span>
                    }
                </div>
            </div>
            <div className="col-start-2 col-span-2 row-start-1 row-span-1 p-4 grid grid-cols-[1fr_auto] gap-x-2 bg-neutral-900 border-b border-neutral-800">
                <SearchWords
                    onOpenWord={onOpenWord}
                />
                <ProfilePicture
                    profilePictureURL="https://m.media-amazon.com/images/S/pv-target-images/5620550b7170b1c281665e148fca399e353c95a68f63195d3c1fa887b8c9dd5d.jpg"
                />
                {reader &&
                    <ProfileToolKit
                        reader={reader}
                        profilePictureURL="https://m.media-amazon.com/images/S/pv-target-images/5620550b7170b1c281665e148fca399e353c95a68f63195d3c1fa887b8c9dd5d.jpg"
                    />
                }
            </div>
            <div className="col-start-1 col-span-1 row-start-2 row-span-1 px-4 py-4 flex flex-col items-center gap-y-6 justify-between bg-neutral-900 border-r border-neutral-800">
                <div className="w-full h-full flex flex-col justify-between gap-y-3">
                    <div className="w-full flex flex-col items-center gap-y-3">
                        <NavBarTab
                            TabIcon={HomeIcon}
                            tabLabel="Home"
                            selected={page === "home"}
                            onClick={() => router.push("/reader/home")}
                            collapse={collapse}
                        />
                        <NavBarTab
                            TabIcon={SettingsIcon}
                            tabLabel="Settings"
                            selected={page === "settings"}
                            onClick={() => router.push("/reader/settings")}
                            collapse={collapse}
                        />
                    </div>
                    <NavBarTab
                        TabIcon={collapse ? ChevronsRightIcon : ChevronsLeftIcon}
                        tabLabel="Collapse Side"
                        selected={false}
                        onClick={() => setCollapse(!collapse)}
                        collapse={collapse}
                    />
                </div>
            </div>
            <div className="col-start-2 col-span-1 row-start-2 row-span-1 bg-neutral-950 grid grid-cols-1 grid-rows-1 overflow-clip">
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
                        allowLog={false}
                    />
                </Fragment>
            ))}
        </div>
    )
}