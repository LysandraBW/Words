import Button from "@/components/Button";
import InputText from "@/components/input/InputText";
import { BookType, selectBookChapters } from "@/services/server/book";
import { insertDeck, DeckType, CreateDeckType } from "@/services/server/deck";
import { createForm, Form, getFormData, testForm, updateFormValue } from "@/utilities/form";
import { useEffect, useState } from "react";
import z from "zod";
import InputCheckboxes from "@/components/input/InputCheckbox/InputCheckboxes";
import { toggleValue } from "@/utilities/array";
import { ChapterType, selectChapterWords } from "@/services/server/chapter";
import { WordType } from "@/services/server/word";
import Panel from "@/components/Panel";
import InputButton from "@/components/input/InputButton";
import clsx from "clsx";
import InputLabel from "@/components/input/InputLabel";
import { ChevronDownIcon } from "lucide-react";


interface CreateDeckProps {
    books: BookType[];
    onClose: () => void;
    onDeckCreated: (deck: DeckType) => void;
}


export default function CreateDeck(props: CreateDeckProps) {
    const [bookToChaptersToWords, setBookToChaptersToWords] = useState<{[bookID: number]: [ChapterType, WordType[]][]}>(); 
    const [form, setForm] = useState<Form<CreateDeckType>>(createForm([
        {
            label: 'deck_name',
            value: '',
            test: z.string().trim().min(1, "Must enter a name")
        },
        {
            label: 'deck_words',
            value: [],
            test: z.array(z.number())
        }
    ]));
    
    
    useEffect(() => {
        const load = async () => {
            try {
                // Load Data
                // Structure: [book, [chapter, [words]]]
                const data: [number, [ChapterType, WordType[]][]][] = await Promise.all(props.books.map(async book => {
                    console.log(book);
                    return [
                        book.book_id,
                        await selectBookChapters(book.book_id).then(async chapters => await Promise.all(chapters.map(async chapter => {
                            return [
                                chapter,
                                await selectChapterWords(chapter.chapter_id)
                            ]
                        })))
                    ];
                }));

                const booksToChaptersToWords: {[bookID: number]: [ChapterType, WordType[]][]} = {};
                for (const [bookID, chaptersToWords] of data) {
                    // Initialize Book Entry
                    if (!(bookID in booksToChaptersToWords))
                        booksToChaptersToWords[bookID] = [];
                    for (const [chapter, words] of chaptersToWords) {
                        booksToChaptersToWords[bookID].push([chapter, words]);
                    }
                }

                setBookToChaptersToWords(booksToChaptersToWords);
            }
            catch (err) {
                alert(err);
            }
        }
        load();
    }, [props.books]);

    
    const onCreateDeck = async (form: Form<CreateDeckType>) => {
        try {
            if (!testForm(form))
                throw new Error('Invalid Form');

            const deck = getFormData(form);
            const inserted = await insertDeck(deck);
            props.onDeckCreated(inserted);
        }
        catch (error) {
            alert(error);
        }
    }

    
    const onToggleChapter = (chapterID: number) => {
        setForm(form => updateFormValue(
            form, 
            'deck_words', 
            toggleValue(chapterID, form.deck_words.value)
        ));
    }


    if (!bookToChaptersToWords)
        return <>Loading</>;


    return (
        <Panel
            title="Create Deck"
            onClose={props.onClose}
        >
            <div className="px-8 py-6 flex flex-col gap-y-6">
                <InputText
                    label="Deck Name"
                    value={form.deck_name.value}
                    onChange={value => setForm(updateFormValue(form, 'deck_name', value))}
                />
                <div>
                    <InputLabel
                        label="Add Words"
                    />
                    <div className="p-2 flex flex-col gap-y-2 bg-neutral-900 border border-neutral-800 shadow-md rounded-md">
                        {props.books.map((book, i) => (
                            <div 
                                key={i}
                                className="p-2 flex flex-col gap-y-2 bg-neutral-800 border border-neutral-700 shadow-md rounded-lg"
                            >
                                <div className="flex justify-between items-center">
                                    <p className="text-sm text-neutral-200 font-medium">
                                        {book.book_name}
                                    </p>
                                    <div className="w-5 aspect-square flex justify-center items-center bg-blue-600 border border-blue-500 rounded-full">
                                        <ChevronDownIcon
                                            size={14}
                                            strokeWidth={2}
                                            className="scale-x-80 stroke-neutral-100"
                                        />
                                    </div>
                                </div>
                                {(bookToChaptersToWords?.[book.book_id] || []).length === 0 &&
                                    <div className="w-full h-fit px-4 py-2 bg-neutral-700 rounded-md">
                                        <p className="text-center text-sm font-medium">
                                            No Chapters (or Words)
                                        </p>
                                    </div>
                                }
                                {(bookToChaptersToWords?.[book.book_id] || []).map(([chapter, words], i) => (
                                    <div 
                                        key={i}
                                        className={clsx(
                                            "px-2 py-2 flex flex-col gap-y-2 bg-neutral-950/50 border border-neutral-700 shadow-md rounded-lg",
                                            // words.length === 0 ? "gap-y-4" : "gap-y-2"
                                        )}
                                    >
                                        <p className="text-neutral-200 text-sm">
                                            <span className="w-full block px-2 py-[2px] bg-neutral-800 border border-neutral-700 rounded-md shadow text-sm text-neutral-200">Chapter {chapter.chapter_number}: {chapter.chapter_title}</span>
                                        </p>
                                        {words.length === 0 &&
                                            <div className="w-full h-fit px-4 py-2 bg-neutral-950/50 rounded-md">
                                                <p className="text-center text-sm font-medium">
                                                    No Words
                                                </p>
                                            </div>
                                        }
                                        {words.length !== 0 &&
                                            <InputCheckboxes
                                                value={form.deck_words.value}
                                                options={words.map(word => ({
                                                    value: word.word_id,
                                                    textLabel: word.word[0]
                                                }))}
                                                onChange={onToggleChapter}
                                                labelClassName="!text-sm"
                                                inputWrapperClassName="px-2 py-1 bg-neutral-950/50 rounded-md"
                                            />
                                        }
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
                <InputButton
                    label="Create Deck"
                    onClick={() => onCreateDeck(form)}
                />
            </div>
        </Panel>
    )
}