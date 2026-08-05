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
import { BookSearchIcon, ListIcon, PlusIcon, SearchIcon, TelescopeIcon, TextAlignJustifyIcon, WindIcon, WorkflowIcon } from "lucide-react";
import { useEffect, useState } from "react";
import z from "zod";
import example from "./example";
import Level from "@/components/word/Level";
import Inflection from "@/components/word/Inflections";
import InputTextArea from "@/components/input/InputTextArea";

interface LogWordProps {
    book?: BookType;
    chapter?: ChapterType;
    onClose: () => void;
    books?: BookType[];
    chapters?: ChapterType[];
}

export default function LogWord(props: LogWordProps) {
    const [type, setType] = useState('Manual');
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
            value: props.book ? `${props.book.book_id}` : '',
            test: z.number().optional()
        },
        {
            label: "chapter_id",
            value: props.chapter ? `${props.chapter.chapter_id}` : '',
            test: z.number().optional()
        }
    ]));

    useEffect(() => {
        const load = async () => {
            // const output = await getWordEntries(selected);
            // console.log(output);
            console.log(example);
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
                            onClick={() => setType('Quick')}
                            className={clsx(
                                "p-1 w-full flex justify-center items-center gap-x-2 border border-r-0 border-neutral-800 rounded-l-md",
                                type === "Quick" && "bg-blue-600 !border-blue-500"
                            )}
                        >
                            <WindIcon
                                size={16}
                                className={clsx(
                                    "text-neutral-500",
                                    type === "Quick" && "!text-neutral-200"
                                )}
                            />
                            <span 
                                className={clsx(
                                    "text-sm text-neutral-400 font-medium",
                                    type === "Quick" && "!text-neutral-100"
                                )}
                            >
                                Quick
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
                    {type === "Quick" &&
                        <div className="w-full h-full flex-col">
                            <InputDropdown
                                // label="Search Word"
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
                                toggleClassName={clsx(
                                    "!h-[40px] !min-h-[40px] pl-4 bg-neutral-900 border-l-0 !border-neutral-800 !rounded-r-md rounded-l-none !text-sm placeholder:!text-sm placeholder:!tracking-normal placeholder:!text-neutral-500",
                                    selected && "!rounded-bl-none !rounded-br-none"
                                )}
                                optionsContainerClassName="!w-full !bg-neutral-900 !border-neutral-900 !rounded-md"
                                optionContainerClassName="!py-2 !border-b !border-b-neutral-900 last:!border-b-0 group hover:!bg-neutral-900"
                                optionClassName="!text-neutral-500/75 !text-sm group-hover:!text-neutral-400 tracking-wide"
                                itemName="Words"
                                toggleLabel="Search"
                                toggleLabelClassName="!text-sm"
                                search
                                // searchPlaceholder="Search Merriam-Webster"
                                elementLeft={(
                                    <div 
                                        className={clsx(
                                            "!h-[40px] !min-h-[40px] px-4 flex items-center bg-neutral-900 border border-neutral-800 rounded-l-md",
                                            selected && "!rounded-bl-none"
                                        )}
                                    >
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
                            {selectedEntry &&
                                <div className="w-full min-h-10 max-h-full grid grid-rows-[auto_1fr] bg-neutral-900 border border-t-0 border-neutral-800 rounded-b-lg overflow-auto">
                                    <div>
                                        <div className="relative w-full h-8 flex gap-x-1 bg-neutral-900 border-b border-neutral-800 rounded-t-md shadow-sm">
                                            <button 
                                                onClick={() => setShortOrLong('Short')}
                                                className={clsx(
                                                    "p-1 w-full flex justify-center items-center gap-x-2 border-r- border-transparent rounded-m-d",
                                                    shortOrLong === "Short" && "borderr- !border-neutral-700 bg-neutral-800"
                                                )}
                                            >
                                                <ListIcon
                                                    size={12}
                                                    className={clsx(
                                                        "text-neutral-500",
                                                        shortOrLong === "Short" && "!text-neutral-400"
                                                    )}
                                                />
                                                <span 
                                                    className={clsx(
                                                        "text-sm text-neutral-400 font-medium",
                                                        shortOrLong === "Short" && "!text-neutral-300"
                                                    )}
                                                >
                                                    Short
                                                </span>
                                            </button>
                                            <button 
                                                onClick={() => setShortOrLong('Long')}
                                                className={clsx(
                                                    "p-1 w-full flex justify-center items-center gap-x-2 border-l- border-transparent rounded-m-d",
                                                    shortOrLong === "Long" && "border-- !border-neutral-700 bg-neutral-800"
                                                )}
                                            >
                                                <TextAlignJustifyIcon
                                                    size={12}
                                                    className={clsx(
                                                        "text-neutral-500",
                                                        shortOrLong === "Long" && "!text-neutral-400"
                                                    )}
                                                />
                                                <span 
                                                    className={clsx(
                                                        "text-sm text-neutral-400 font-medium",
                                                        shortOrLong === "Long" && "!text-neutral-300"
                                                    )}
                                                >
                                                    Long
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                    {shortOrLong === 'Short' &&
                                        <>
                                            <div className="h-full max-h-full flex flex-col gap-y-6 min-h-0  overflow-auto p-2 pl-0 ">
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
                                                                        className="grid grid-cols-[1fr_18px] gap-x-6"    
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
                                                                            className="aspect-square h-min flex justify-center items-center bg-blue-600 border border-blue-500 rounded-md shadow-sm"    
                                                                        >
                                                                            <PlusIcon
                                                                                size={10}
                                                                                className="stroke-neutral-100 scale-x-95"
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
                                        <div className="w-full bg-neutral-900 border-x- border-b- border-neutral-800 rounded-b-md p-2 pl-0 flex flex-col gap-y-10 max-h-[300px]- overflow-auto">
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
                        </div>
                    }
                    {type === "Manual" &&
                        <>
                            <InputText
                                label="Word"
                                value={form.word.value}
                                onChange={(value) => setForm(updateFormValue(form, "word", value))}
                                required={true}
                                error={form.word.error}
                            />
                            <InputTextArea
                                label="Meaning"
                                value={form.meaning.value}
                                onChange={(value) => setForm(updateFormValue(form, "meaning", value))}
                                required={true}
                                error={form.meaning.error}
                            />
                            <InputDropdown
                                label="Book"
                                toggleLabel={props.books?.find(book => book.book_id === Number(form.book_id.value))?.book_name}
                                value={[form.book_id.value]}
                                options={props.books?.map(book => ({
                                    value: book.book_id + "",
                                    textLabel: book.book_name,
                                    optionLabel: (
                                        <div className="overflow-clip text-inherit">
                                            <span className="block truncate text-inherit group-hover:text-blue-400 text-sm font-medium">
                                                {book.book_name}
                                            </span>
                                            <span className="block text-xs text-neutral-500">
                                                {book.book_year || "No Date Listed"}, {`By ${book.book_author.join(', ')}` || "No Publisher Listed"}
                                            </span>
                                        </div>
                                    )
                                }))}
                                onChange={(value) => setForm(updateFormValue(form, "book_id", value))}
                                error={form.book_id.error}
                            />
                            <InputDropdown
                                label="Book Chapter"
                                toggleLabel={props.chapters?.find(chapter => chapter.chapter_id === Number(form.chapter_id.value))?.chapter_title}
                                value={[form.chapter_id.value]}
                                options={props.chapters?.filter(chapter => `${chapter.book_id}` === form.book_id.value).map(chapter => ({
                                    value: chapter.chapter_id + "",
                                    textLabel: chapter.chapter_title,
                                    optionLabel: (
                                        <div className="overflow-clip text-inherit">
                                            <span className="block truncate text-inherit group-hover:text-blue-400 text-sm font-medium">
                                                {chapter.chapter_title}
                                            </span>
                                        </div>
                                    )
                                }))}
                                onChange={(value) => setForm(updateFormValue(form, "book_id", value))}
                                error={form.chapter_id.error}
                            />
                            <InputButton
                                label="Log Word"
                            />
                        </>
                    }
                    
                </div>
            </div>
        </Panel>
    )
}