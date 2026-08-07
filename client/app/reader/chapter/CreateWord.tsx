import InputDropdown from "@/components/input/InputDropdown";
import Panel from "@/components/Panel";
import ShowEntry from "@/components/word/ShowEntry";
import { BookType } from "@/services/server/book";
import { ChapterType } from "@/services/server/chapter";
import getSuggestions from "@/services/words/getAutoCompletion";
import getWordEntries, { Entry } from "@/services/words/getWordEntry";
import { createForm, Form, getFormData, testForm, updateFormValues } from "@/utilities/form";
import clsx from "clsx";
import { BookSearchIcon, ListIcon, TextAlignJustifyIcon, WindIcon, WorkflowIcon } from "lucide-react";
import { useEffect, useState } from "react";
import z from "zod";
import example from "./example";
import CreateWordManual from "@/components/word/CreateWordManual";
import ShowEntryShort from "@/components/word/ShowEntryShort";
import CreateTypeTab from "@/components/word/CreateTypeTab";
import EntryTypeTab from "@/components/word/EntryTypeTab";
import SelectBookAndChapter from "@/components/word/SelectBookAndChapter";
import { insertWord, WordType } from "@/services/server/word";


interface CreateWordProps {
    book?: BookType;
    chapter?: ChapterType;
    onClose: () => void;
    onWordCreated: (word: WordType) => void;
    books: BookType[];
    chapters: ChapterType[];
    requireChapter?: boolean;
}


interface WordData {
    word: string;
    meaning: string;
    book_id: string;
    chapter_id: string;
}


export default function CreateWord(props: CreateWordProps) {
    const [type, setType] = useState('Manual');
    const [selected, setSelected] = useState<string>('set');
    const [selectedEntry, setSelectedEntry] = useState<Entry[]>();
    
    const [shortOrLong, setShortOrLong] = useState('Short');
    
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [form, setForm] = useState<Form<WordData>>(createForm([
        
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


    const onCreateWord = async (form: Form<WordData>) => {
        try {
            if (!testForm(form))
                throw new Error('Invalid Form');

            const data = getFormData(form);
            const inserted = await insertWord({
                word: [
                    data.word, 
                    data.meaning
                ],
                chapter_id: Number(data.chapter_id)
            });
            props.onWordCreated(inserted);
        }
        catch (error) {
            alert(error);
        }
    }


    useEffect(() => {
        const load = async () => {
            setSelectedEntry(example as any);
        }
        load()
    }, [selected]);


    return (
        <Panel
            title="Log Word"
            onClose={props.onClose}
        >
            <div className="px-8 py-4">
                <div className="relative w-full h-8 flex gap-x-[1px] bg-neutral-900 rounded-md shadow-sm">
                    <div className="absolute h-full w-[1px] left-[calc(50%-1px)] bg-blue-500"/>
                    <CreateTypeTab
                        label='Quick'
                        Icon={WindIcon}
                        selected={type === 'Quick'}
                        onClick={() => setType('Quick')}
                        outerClassName="!border-r-0 !rounded-l-md"
                    />
                    <CreateTypeTab
                        label='Manual'
                        Icon={WorkflowIcon}
                        selected={type === 'Manual'}
                        onClick={() => setType('Manual')}
                        outerClassName="!border-l-0 !rounded-r-md"
                    />
                </div>
            </div>
            <div className="px-8 py-4 border-t border-neutral-900 flex flex-col gap-y-6">
                {type === "Quick" &&
                    <div className="flex flex-col gap-y-8">
                        {props.requireChapter &&
                            <SelectBookAndChapter
                                books={props.books}
                                chapters={props.chapters}
                                form={form}
                                setForm={setForm}
                            />
                        }
                        <div className="w-full h-full flex-col">
                            <p className="mb-2 text-neutral-300 font-medium">
                                Select Word
                            </p>
                            <InputDropdown
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
                            {(selected && selectedEntry && typeof selectedEntry[0] !== "string") &&
                                <div className="w-full min-h-10 max-h-full grid grid-rows-[auto_1fr] bg-neutral-900 border border-t-0 border-neutral-800 rounded-b-lg overflow-auto">
                                    <div className="relative w-full h-8 flex gap-x-1 bg-neutral-900 border-b border-neutral-800 rounded-t-md shadow-sm">
                                        <EntryTypeTab
                                            label="Short"
                                            Icon={ListIcon}
                                            onClick={() => setShortOrLong('Short')}
                                            selected={shortOrLong === "Short"}
                                        />
                                        <EntryTypeTab
                                            label="Long"
                                            Icon={TextAlignJustifyIcon}
                                            onClick={() => setShortOrLong('Long')}
                                            selected={shortOrLong === "Long"}
                                        />
                                    </div>
                                    {shortOrLong === 'Short' &&
                                        <div className="h-full max-h-full flex flex-col gap-y-6 min-h-0 overflow-auto p-2 pl-0 ">
                                            {selectedEntry.map((entry: Entry, i: number) => (
                                                <div key={i}>
                                                    <ShowEntryShort
                                                        entry={entry}
                                                        entryNum={i+1}
                                                        numEntries={selectedEntry.length}
                                                        onOpenWord={(word) => setSelected(word)}
                                                        allowLog
                                                        onLog={(definition: string) => {
                                                            const updatedForm = updateFormValues(form, {
                                                                "word": selected,
                                                                "meaning": definition
                                                            });
                                                            setForm(updatedForm);
                                                            onCreateWord(updatedForm);
                                                        }}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    }
                                    {shortOrLong === 'Long' &&
                                        <div className="w-full bg-neutral-900 border-x- border-b- border-neutral-800 rounded-b-md p-2 pl-0 flex flex-col gap-y-10 max-h-[300px]- overflow-auto">
                                            {selectedEntry.map((entry: Entry, i: number) => (
                                                <div key={i}>
                                                    <ShowEntry
                                                        entry={entry}
                                                        entryNum={i+1}
                                                        numEntries={selectedEntry.length}
                                                        onOpenWord={(word) => setSelected(word)}
                                                        allowLog
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    }
                                </div>
                            }
                        </div>
                    </div>
                }
                {type === "Manual" &&
                    <div className="flex flex-col gap-y-8">
                        <CreateWordManual
                            form={form}
                            setForm={setForm}
                            books={props.books}
                            chapters={props.chapters}
                            onCreate={() => onCreateWord(form)}
                        />
                    </div>
                }
            </div>
        </Panel>
    )
}