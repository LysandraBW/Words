"use client";
import InputCheckbox from "@/components/input/InputCheckbox/InputCheckbox";
import InputDropdown from "@/components/input/InputDropdown";
import InputText from "@/components/input/InputText";
import clsx from "clsx";
import { BookIcon, ClipboardIcon, LayoutGridIcon, LayoutListIcon, LibraryIcon, NotepadText, TrashIcon, WholeWordIcon } from "lucide-react";
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
                            "py-1 px-2 flex justify-center items-center gap-x-2 border border-transparent rounded-lg text-sm text-neutral-500/75 hover:bg-neutral-800",
                            i === tabIndex && "bg-neutral-800 !border-neutral-700 shadow-md !text-neutral-200 font-medium"
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
            <div>
                {/* Action Bar */}
                <div className="h-fit m-2 px-2 grid grid-rows-1 grid-cols-[min-content_min-content_1fr_min-content_min-content] gap-x-2 items-center bg-neutral-900 border border-neutral-800 rounded-lg">
                    <div className="w-min py-2 flex justify-center items-center bg-neutral-900 rounded-l-lg">
                        <div className="!w-[26px] !h-[26px] flex justify-center items-center !bg-neutral-800 border !border-neutral-700 !rounded-md shadow-sm">
                            <InputCheckbox
                                inputClassName="!w-[14px] !h-[14px] rounded-xs !bg-neutral-800 !border-neutral-600 shadow-md"
                            />
                        </div>
                    </div>
                    <div className="w-min py-2 flex justify-center items-center bg-neutral-900">
                        <button className="p-1 w-[26px] h-[26px] flex justify-center items-center bg-neutral-800 border border-neutral-700 rounded-md shadow-sm">
                            <TrashIcon
                                size={14}
                                strokeWidth={1.5}
                                className="stroke-neutral-600"
                            />
                        </button>
                    </div>
                    <div className="w-full h-full flex flex-col grow justify-center bg-neutral-900">
                        <InputText
                            placeholder="Search Books"
                            inputWrapperClassName="!w-full !min-w-full"
                            inputBoxClassName="!p-1 !min-h-auto !max-h-auto !h-auto !bg-neutral-800 !rounded-md !border-neutral-700"
                            inputClassName="!block !px-2 !min-h-[18px] !max-h-[18px] !h-[18px] !p-0 !text-xs !tracking-wide"
                        />
                    </div>
                    <div className="h-full flex flex-col grow justify-center bg-neutral-900">
                        <InputDropdown
                            toggleLabel="Sort by Name"
                            wrapperClassName="min-w-[128px] !min-h-full !max-h-full !flex !flex-col !justify-center"
                            boxClassName="!min-h-min !h-min !max-h-min"
                            toggleClassName="box-content !min-h-[18px] !max-h-[18px] !h-[18px] p-1 !gap-x-2 !bg-neutral-800 !border-neutral-700 !rounded-md shadow-sm"
                            toggleLabelClassName="!text-xs !tracking-wide  whitespace-nowrap"
                        />
                    </div>
                    <div className="py-2">
                        <div className="relative w-min flex gap-x-[1px] bg-neutral-800 rounded-md">
                            <div className="absolute h-full w-[1px] left-[calc(50%+1px)] bg-blue-500"/>
                            <button className="p-1 w-[26px] h-[26px] flex justify-center items-center bg-blue-700 border border-r-0 border-blue-500 rounded-l-md shadow-sm">
                                <LayoutListIcon
                                    size={14}
                                    strokeWidth={1.5}
                                    className="stroke-neutral-200"
                                />
                            </button>
                            <button className="p-1 bg-neutral-800 border border-l-0 border-neutral-700 rounded-r-md">
                                <LayoutGridIcon
                                    size={14}
                                    strokeWidth={1.5}
                                    className="stroke-neutral-600"
                                />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}