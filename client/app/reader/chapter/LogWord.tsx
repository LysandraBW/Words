import InputButton from "@/components/input/InputButton";
import InputDropdown from "@/components/input/InputDropdown";
import InputText from "@/components/input/InputText";
import Panel from "@/components/Panel";
import ShowEntry, { ScribbleTag } from "@/components/word/ShowEntry";
import { BookType } from "@/services/server/book";
import { ChapterType } from "@/services/server/chapter";
import getSuggestions from "@/services/words/getAutoCompletion";
import getWordEntries, { Entry } from "@/services/words/getWordEntry";
import { createForm, Form, updateFormValue, updateFormValues } from "@/utilities/form";
import clsx from "clsx";
import { BookSearchIcon, ListIcon, PlusIcon, SearchIcon, TelescopeIcon, TextAlignJustifyIcon, WorkflowIcon } from "lucide-react";
import { useEffect, useState } from "react";
import z from "zod";
import example from "./example";
import Level from "@/components/word/Level";
import Inflection from "@/components/word/Inflections";

interface LogWordProps {
    book?: BookType;
    chapter?: ChapterType;
    onClose: () => void;
}

export default function LogWord(props: LogWordProps) {
    const [type, setType] = useState('Discover');
    const [selected, setSelected] = useState<string>('set');
    const [selectedEntry, setSelectedEntry] = useState<Entry[]>();
    
    const [shortOrLong, setShortOrLong] = useState('Short');
    
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [form, setForm] = useState<Form<any>>(createForm([
        
        {
            label: "word",
            value: '',
            test: z.string().trim().min(1, "Must enter a word.")
        },
        {
            label: "meaning",
            value: '',
            test: z.string().trim().min(1, "Must enter the word's meaning.")
        },
        {
            label: "book_id",
            value: '',
            test: z.number().optional()
        },
        {
            label: "chapter_id",
            value: '',
            test: z.number().optional()
        }
    ]));

    useEffect(() => {
        const load = async () => {
            // const output = await getWordEntries(selected);
            // console.log(output);
            setSelectedEntry(example as any);
        }
        load()
    }, [selected]);

    return (
        <Panel
            title="Log Word"
            onClose={props.onClose}
        >
            <div className="">
                {/* Toggle */}
                <div className="px-8 py-4">
                    <div className="relative w-full h-8 flex gap-x-[1px] bg-neutral-900 rounded-md shadow-sm">
                        <div className="absolute h-full w-[1px] left-[calc(50%-1px)] bg-blue-500"/>
                        <button 
                            onClick={() => setType('Discover')}
                            className={clsx(
                                "p-1 w-full flex justify-center items-center gap-x-2 border border-r-0 border-neutral-800 rounded-l-md",
                                type === "Discover" && "bg-blue-600 !border-blue-500"
                            )}
                        >
                            <TelescopeIcon
                                size={16}
                                className={clsx(
                                    "text-neutral-500",
                                    type === "Discover" && "!text-neutral-200"
                                )}
                            />
                            <span 
                                className={clsx(
                                    "text-sm text-neutral-400 font-medium",
                                    type === "Discover" && "!text-neutral-100"
                                )}
                            >
                                Discover
                            </span>
                        </button>
                        <button 
                            onClick={() => setType('Manual')}
                            className={clsx(
                                "p-1 w-full flex justify-center items-center gap-x-2 border border-l-0 border-neutral-800 rounded-r-md",
                                type === "Manual" && "bg-blue-600 !border-blue-500",
                            )}
                        >
                            <WorkflowIcon
                                size={16}
                                className={clsx(
                                    "text-neutral-500",
                                    type === "Manual" && "!text-neutral-200"
                                )}
                            />
                            <span 
                                className={clsx(
                                    "text-sm text-neutral-400 font-medium",
                                    type === "Manual" && "!text-neutral-100"
                                )}
                            >
                                Manual
                            </span>
                        </button>
                    </div>
                </div>
                <div className="px-8 py-4 border-t border-neutral-900 flex flex-col gap-y-6">
                    <span className="text-neutral-200 text-lg font-medium">
                        Manually Enter Word
                    </span>
                    <div className="w-full h-full flex">
                        <InputDropdown
                            label="Search Word"
                            value={[selected]}
                            options={suggestions.map((suggestion, i) => ({
                                value: suggestion,
                                textLabel: suggestion,
                                optionLabel: (
                                    <div className="flex items-center">
                                        {suggestion}
                                    </div>
                                )
                            }))}
                            onSearchChange={(value: string) => setSuggestions(getSuggestions(value))}
                            onChange={async (value: string) => {
                                setSelected(value);
                                setSelectedEntry(await getWordEntries(value));
                            }}
                            wrapperClassName="w-full rounded-md"
                            toggleClassName="!h-[40px] !min-h-[40px] pl-4 bg-neutral-900 border-l-0 !border-neutral-800 !rounded-r-md rounded-l-none !text-sm placeholder:!text-sm placeholder:!tracking-normal placeholder:!text-neutral-500"
                            optionsContainerClassName="!w-full !bg-neutral-900 !border-neutral-900 !rounded-md"
                            optionContainerClassName="!py-2 !border-b !border-b-neutral-900 last:!border-b-0 group hover:!bg-neutral-900"
                            optionClassName="!text-neutral-500/75 !text-sm group-hover:!text-neutral-400 tracking-wide"
                            itemName="Words"
                            // toggleLabel="Search Merriam-Webster"
                            toggleLabelClassName="!text-sm"
                            search
                            // searchPlaceholder="Search Merriam-Webster"
                            elementLeft={(
                                <div className="!h-[40px] !min-h-[40px] px-4 flex items-center bg-neutral-900 border border-neutral-800 rounded-l-md">
                                    <BookSearchIcon
                                        size={18}
                                        className="text-neutral-600"
                                    />
                                </div>
                            )}
                            elementNoResultsFound={(
                                <div className="flex flex-col items-center">
                                    <h6 className="text-neutral-500 font-medium text-sm">
                                        No Results Found
                                    </h6>
                                    <p className="max-w-[256px] text-center text-sm">
                                        Maybe try a different spelling.
                                    </p>
                                </div>
                            )}
                        />
                    </div>
                    {selectedEntry &&
                        <div className="w-full min-h-10 bg-neutral-900 border border-neutral-800 rounded-lg">
                            <div>
                                <div className="relative w-full p-1 h-9 flex gap-x-1 bg-neutral-900 border-b border-neutral-800 rounded-t-md shadow-sm">
                                    {/* <div className="absolute h-full w-[1px] left-[calc(50%-1px)] bg-blue-500"/> */}
                                    <button 
                                        onClick={() => setShortOrLong('Short')}
                                        className={clsx(
                                            "p-1 w-full flex justify-center items-center gap-x-2 border border-transparent rounded-md",
                                            shortOrLong === "Short" && "border border-neutral-500 bg-neutral-500"
                                        )}
                                    >
                                        <ListIcon
                                            size={16}
                                            className={clsx(
                                                "text-neutral-500",
                                                shortOrLong === "Short" && "!text-neutral-200"
                                            )}
                                        />
                                        <span 
                                            className={clsx(
                                                "text-sm text-neutral-400 font-medium",
                                                shortOrLong === "Short" && "!text-neutral-100"
                                            )}
                                        >
                                            Short
                                        </span>
                                    </button>
                                    <button 
                                        onClick={() => setShortOrLong('Long')}
                                        className={clsx(
                                            "p-1 w-full flex justify-center items-center gap-x-2 border border-transparent  rounded-md",
                                            shortOrLong === "Long" && "border border-neutral-500 bg-neutral-500"
                                        )}
                                    >
                                        <TextAlignJustifyIcon
                                            size={16}
                                            className={clsx(
                                                "text-neutral-500",
                                                shortOrLong === "Long" && "!text-neutral-200"
                                            )}
                                        />
                                        <span 
                                            className={clsx(
                                                "text-sm text-neutral-400 font-medium",
                                                shortOrLong === "Long" && "!text-neutral-100"
                                            )}
                                        >
                                            Long
                                        </span>
                                    </button>
                                </div>
                            </div>
                            {shortOrLong === 'Short' &&
                                <>
                                    <div className="flex flex-col gap-y-6 max-h-[300px] overflow-auto p-2 pl-0 ">
                                        {selectedEntry.map((entry: Entry, i: number) => (
                                            <div key={i} className="grid grid-cols-[auto_1fr]">
                                                <Level
                                                    level={-1}
                                                    label={""}
                                                    long={true}
                                                />
                                                <div
                                                    className="w-full flex flex-col gap-y-1"
                                                >
                                                    <div className="flex items-center gap-x-2"> 
                                                        <h6 className="text-xl text-neutral-100 font-medium capitalize uppercase">
                                                            {entry.meta.id.split(":")[0]}
                                                        </h6>
                                                        <ScribbleTag
                                                            text={`${i+1}/${selectedEntry.length}`}
                                                            className="text-blue-500"
                                                        />
                                                        {entry.fl &&
                                                            <ScribbleTag
                                                                text={entry.fl}
                                                                className="text-blue-500"
                                                            />
                                                        }
                                                    </div>
                                                    {entry.ins &&
                                                        <Inflection
                                                            ins={entry.ins}
                                                        />
                                                    }
                                                    <div className="flex flex-col gap-y-3">
                                                        {entry.shortdef?.map((def: string, j: number) => (
                                                            <div 
                                                                key={j}
                                                                className="grid grid-cols-[1fr_24px]"    
                                                            >
                                                                <div className="flex">
                                                                    <div className="w-6 min-w-6 flex flex-col items-center">
                                                                        <span className="text-white font-medium">{j + 1}</span>
                                                                    </div>
                                                                    <p className="text-base text-neutral-100 tracking-wide">
                                                                        : {def}
                                                                    </p>
                                                                </div>
                                                                <button 
                                                                    onClick={() => {
                                                                        const updatedForm = updateFormValues(form, {
                                                                            "word": selected,
                                                                            "meaning": def
                                                                        });
                                                                        setForm(updatedForm);
                                                                    }}
                                                                    className="aspect-square h-min flex justify-center items-center bg-neutral-800 border border-neutral-700 rounded-md shadow-sm"    
                                                                >
                                                                    <PlusIcon
                                                                        size={14}
                                                                        className="stroke-neutral-500 scale-x-95"
                                                                    />
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            }
                            {shortOrLong === 'Long' &&
                                <div className="w-full bg-neutral-900 border-x- border-b- border-neutral-800 rounded-b-md p-2 pl-0 flex flex-col gap-y-10 max-h-[300px] overflow-auto">
                                    {selectedEntry.map((entry: Entry, i: number) => (
                                        <div
                                            key={i}
                                        >
                                            <ShowEntry
                                                entry={entry}
                                                entryNum={i+1}
                                                numEntries={selectedEntry.length}
                                                onOpenWord={(word) => setSelected(word)}
                                            />
                                        </div>
                                    ))}
                                </div>
                            }
                            
                        </div>
                    }
                    <InputText
                        label="Word"
                        value={form.word.value}
                        onChange={(value) => setForm(updateFormValue(form, "word", value))}
                        required={true}
                        error={form.word.error}
                    />
                    <InputText
                        label="Meaning"
                        value={form.meaning.value}
                        onChange={(value) => setForm(updateFormValue(form, "meaning", value))}
                        required={true}
                        error={form.meaning.error}
                    />
                    <InputText
                        label="Book"
                        value={form.book_id.value}
                        onChange={(value) => setForm(updateFormValue(form, "book_id", value))}
                        error={form.book_id.error}
                    />
                    <InputText
                        label="Chapter (in Book)"
                        value={form.chapter_id.value}
                        onChange={(value) => setForm(updateFormValue(form, "chapter_id", value))}
                        error={form.chapter_id.error}
                    />
                    <InputButton
                        label="Log Word"
                    />
                </div>
            </div>
        </Panel>
    )
}