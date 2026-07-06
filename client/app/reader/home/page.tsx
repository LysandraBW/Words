"use client";
import loadData from "@/app/home/loadData";
import InputCheckbox from "@/components/input/InputCheckbox/InputCheckbox";
import InputDropdown from "@/components/input/InputDropdown";
import InputText from "@/components/input/InputText";
import useFilterObjects from "@/hooks/useFilterObject";
import { BookType } from "@/services/server/book";
import { DeckType, deleteDeck } from "@/services/server/deck";
import getWordEntries, { Entry } from "@/services/words/getWordEntry";
import clsx from "clsx";
import { BookIcon, ChevronLeftIcon, ChevronRightIcon, ChevronsLeftIcon, ChevronsRightIcon, ClipboardIcon, LayoutGridIcon, LayoutListIcon, LibraryIcon, MinusIcon, NotepadText, TrashIcon, WholeWordIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Option } from "@/components/input/InputDropdown";

export default function Page() {
    const tabs = ["Books", "Chapters", "Words", "Decks"];
    const [tabIndex, setTabIndex] = useState(0);
    
    const [data, setData] = useState<Awaited<ReturnType<typeof loadData>>>();
    const [show, setShow] = useState('');


    const [wordLookup, setWordLookup] = useState<{[word: string]: {entries: Entry[], z: number}}|null>();


    const filterBooks = useFilterObjects({ objects: data?.books ||  []});
    const bookSearchOptions: Option<keyof BookType>[] = [
        {
            value: "book_name",
            textLabel: "Name"
        },
        {
            value: "book_author",
            textLabel: "Author"
        }
    ]
    const bookSortOptions: Option<keyof BookType>[] = [
        {
            value: "book_name",
            textLabel: "Name"
        },
        {
            value: "book_author",
            textLabel: "Author"
        },
        {
            value: "book_year",
            textLabel: "Year"
        }
    ]

    useEffect(() => {
        const load = async () => {
            try {
                const data = await loadData();
                setData(data);
            }
            catch (err) {
                alert(err);
            }
        }
        load();
    }, []);


    const handleBookCreated = (book: BookType) => {
        setData(data => {
            if (!data)
                return data;
            return {
                ...data,
                books: [
                    ...data.books, 
                    book
                ]
            }
        });
        setShow('');
    }


    const handleDeckCreated = (deck: DeckType) => {
        setData(data => {
            if (!data)
                return data;
            return {
                ...data,
                decks: [
                    ...data.decks, 
                    deck
                ]
            }
        });
        setShow('');
    }


    const handleDeckDeleted = (deck: DeckType) => {
        setData(data => {
            if (!data)
                return data;
            return {
                ...data,
                decks: data.decks.filter(d => d.deck_id !== deck.deck_id)
            }
        });
        setShow('');
    }


    const onDeleteDeck = async (deckID: number) => {
        try {
            const deletedDeck = await deleteDeck(deckID);
            handleDeckDeleted(deletedDeck);
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
                            i === tabIndex && "bg-blue-600 !border-blue-500 shadow-md !text-neutral-200 font-medium"
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
                <div className="h-fit m-2 mb-0 px-2 grid grid-rows-1 grid-cols-[min-content_min-content_1fr_min-content_min-content] gap-x-2 items-center bg-neutral-900 border border-neutral-800 rounded-t-lg">
                    <div className="w-min py-2 flex justify-center items-center bg-neutral-900 rounded-l-lg">
                        <div className="!w-[26px] !h-[26px] flex justify-center items-center !bg-neutral-800 border !border-neutral-700 !rounded-md shadow-sm">
                            <InputCheckbox
                                inputClassName="!w-[14px] !h-[14px] rounded-sm !bg-neutral-800 border !border-neutral-600 shadow-md"
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
                <div className="mx-2 grid grid-cols-[calc(26px+16px)_1fr_1fr_1fr] items-center bg-neutral-900/50 border border-t-0 border-neutral-800">
                    <div className="px-3.5">
                        <InputCheckbox/>
                    </div>
                    <div className="px-2 py-2 border-l border-l-neutral-800">
                        <p className="text-xs font-medium tracking-wide">
                            Name
                        </p>
                    </div>
                    <div className="px-2 py-2 border-l border-l-neutral-800">
                        <p className="text-xs font-medium tracking-wide">
                            Author
                        </p>
                    </div>
                    <div className="px-2 py-2 border-l border-l-neutral-800">
                        <p className="text-xs font-medium tracking-wide">
                            Year
                        </p>
                    </div>
                </div>
                <div className="mx-2">
                    <div className="grid grid-cols-[calc(26px+16px)_1fr_1fr_1fr] items-center bg-neutral-900/25 border-x border-b border-neutral-800 hover:bg-neutral-900/0">
                        <div className="h-full flex items-center justify-center">
                            <InputCheckbox/>
                        </div>
                        <div className="h-full p-2 flex items-center gap-x-2 border-l border-neutral-800">
                            <div className="h-full aspect-square bg-yellow-500">
                            </div>
                            <p className="text-xs tracking-wide">Lorem Ipsum</p>
                        </div>
                        <div className="h-full p-2 flex items-center border-l border-neutral-800">
                            <p className="text-xs tracking-wide">FName LName</p>
                        </div>
                        <div className="h-full p-2 flex items-center border-l border-neutral-800">
                            <p className="text-xs tracking-wide">1997</p>
                        </div>
                    </div>
                </div>
                <div className="mx-2 p-2 flex justify-center gap-x-2 bg-neutral-900/50 border border-t-0 border-neutral-800 rounded-b-lg">
                    <button className="p-1 h-[26px] aspect-square bg-neutral-800 border border-neutral-700 rounded-md shadow">
                        <ChevronsLeftIcon
                            size={14}
                            strokeWidth={2}
                            className="stroke-neutral-600"
                        />
                    </button>
                    <button className="h-[26px] aspect-square p-1 bg-neutral-800 border border-neutral-700 rounded-md shadow">
                        <ChevronLeftIcon
                            size={14}
                            strokeWidth={2}
                            className="stroke-neutral-600"
                        />
                    </button>
                    <div className="flex items-center gap-x-1">
                        <InputText
                            inputBoxClassName="w-min !h-[26px] !max-h-[26px] !min-h-[26px] !px-1 !py-1 bg-neutral-800 border-neutral-700"
                            inputClassName="!block !min-w-[26px] !min-h-[26px] !max-h-[26px] !h-[26px] !text-xs !tracking-wide text-center"
                        />
                        <MinusIcon
                            size={14}
                            strokeWidth={2}
                            className="stroke-neutral-600"
                        />
                        <InputText
                            value="10"
                            inputBoxClassName="w-min !h-[26px] !max-h-[26px] !min-h-[26px] !px-1 !py-1 bg-neutral-800 border-neutral-700"
                            inputClassName="!block !min-w-[26px] !min-h-[26px] !max-h-[26px] !h-[26px] !text-xs !tracking-wide text-center"
                        />
                    </div>
                    <button className="h-[26px] aspect-square p-1 bg-neutral-800 border border-neutral-700 rounded-md shadow">
                        <ChevronRightIcon
                            size={14}
                            strokeWidth={2}
                            className="stroke-neutral-600"
                        />
                    </button>
                    <button className="h-[26px] aspect-square p-1 bg-neutral-800 border border-neutral-700 rounded-md shadow">
                        <ChevronsRightIcon
                            size={14}
                            strokeWidth={2}
                            className="stroke-neutral-600"
                        />
                    </button>
                </div>
            </div>
        </div>
    )
}