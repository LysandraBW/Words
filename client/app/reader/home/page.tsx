"use client";
import clsx from "clsx";
import { BookIcon, ClipboardIcon, LibraryIcon, NotepadText, WholeWordIcon } from "lucide-react";
import { useState } from "react";

export default function Page() {
    const tabs = ["Books", "Chapters", "Words", "Decks"];
    const [tabIndex, setTabIndex] = useState(0);


    return (
        <div className="flex flex-col">
            <div className="w-full min-h-[196px] max-h-[196px] p-4 grid grid-cols-4 gap-x-4 border-b border-b-neutral-800">
                {/* Statistics */}
                {[...Array(4)].map((e, i) => (
                    <div 
                        key={i}
                        className="bg-neutral-900 border border-neutral-800 rounded-lg shadow"
                    >
                    </div>
                ))}
            </div>
            {/* Tabs */}
            <div className="w-full p-2 grid grid-cols-4 gap-x-2 bg-neutral-900 border-b border-b-neutral-800">
                {tabs.map((tab, i) => (
                    <div 
                        key={i}
                        className={clsx(
                            "py-1.5 px-2 flex justify-center items-center gap-x-2 border border-transparent rounded-lg text-sm text-neutral-500/75 hover:bg-neutral-800",
                            i === tabIndex && "bg-neutral-800 !border-neutral-700 shadow-md !text-neutral-100"
                        )}
                    >
                        {tab === "Books" &&
                            <LibraryIcon
                                size={16}
                                strokeWidth={1.5}
                            />
                        }
                        {tab === "Chapters" &&
                            <BookIcon
                                size={16}
                                strokeWidth={1.5}
                            />
                        }
                        {tab === "Words" &&
                            <WholeWordIcon
                                size={18}
                                strokeWidth={1.5}
                            />
                        }
                        {tab === "Decks" &&
                            <ClipboardIcon
                                size={16}
                                strokeWidth={1.5}
                            />
                        }
                        {tab}
                    </div>
                ))}
            </div>
        </div>
    )
}