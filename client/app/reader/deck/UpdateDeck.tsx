import Button from "@/components/Button";
import InputButton from "@/components/input/InputButton";
import InputCheckboxes from "@/components/input/InputCheckbox/InputCheckboxes";
import InputLabel from "@/components/input/InputLabel";
import InputText from "@/components/input/InputText";
import Panel from "@/components/Panel";
import { BookType, selectBookChapters, selectBookWords } from "@/services/server/book";
import { ChapterType, selectChapterWords } from "@/services/server/chapter";
import { DeckType, updateDeck } from "@/services/server/deck"
import { WordType } from "@/services/server/word";
import { sameArrays, toggleValue } from "@/utilities/array";
import { createForm, Form, getFormData, testForm, updateFormValue } from "@/utilities/form";
import clsx from "clsx";
import { ChevronDownIcon } from "lucide-react";
import { useEffect, useState } from "react";
import z from "zod";


interface UpdateDeckProps {
    deck: DeckType;
    books: BookType[];
    onClose: () => void;
    onDeckUpdated: (deck: Awaited<ReturnType<typeof updateDeck>>, words: WordType[]) => void;
}


export default function UpdateDeck(props: UpdateDeckProps) {
    const [words, setWords] = useState<WordType[]>();
    const [bookToChaptersToWords, setBookToChaptersToWords] = useState<{[bookID: number]: [ChapterType, WordType[]][]}>(); 
    const [form, setForm] = useState<Form<DeckType>>(createForm([
        {
            label: 'deck_name',
            value: props.deck.deck_name,
            test: z.any()
        },
        {
            label: 'deck_words',
            value: props.deck.deck_words,
            test: z.any()
        }
    ]));


    useEffect(() => {
        const load = async () => {
            try {
                // Load Data
                // Structure: [book, [chapter, [words]]]
                const data: [number, [ChapterType, WordType[]][]][] = await Promise.all(props.books.map(async book => {
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

                const words: WordType[] = [];
                const booksToChaptersToWords: {[bookID: number]: [ChapterType, WordType[]][]} = {};
                for (const [bookID, chaptersToWords] of data) {
                    // Initialize Book Entry
                    if (!(bookID in booksToChaptersToWords))
                        booksToChaptersToWords[bookID] = [];
                    for (const [chapter, chapterWords] of chaptersToWords) {
                        booksToChaptersToWords[bookID].push([chapter, chapterWords]);
                        words.push(...chapterWords);
                    }
                }
                setWords(words);
                setBookToChaptersToWords(booksToChaptersToWords);
            }
            catch (err) {
                alert(err);
            }
        }
        load();
    }, [props.books]);


    if (!words || !bookToChaptersToWords)
        return <>Loading</>;


    const onUpdateDeck = async (form: Form<DeckType>) => {
        try {
            if (!testForm(form))
                throw new Error('Invalid Form');

            const deck = getFormData(form);
            const updatedDeck = await updateDeck({
                deck_id: props.deck.deck_id,
                deck_name: deck.deck_name,
                deck_words: sameArrays(props.deck.deck_words, deck.deck_words) ? null : deck.deck_words
            });

            // Updated Words
            // We could just call the function to load all the words.
            // But, I'd feel like that would be wasteful. We already
            // have all the words!
            const updatedWords = words.filter(word => deck.deck_words.includes(word.word_id));
            props.onDeckUpdated(updatedDeck, updatedWords);
        }
        catch (err) {
            alert(err);
        }
    }


    const onToggleChapter = (chapterID: number) => {
        setForm(form => updateFormValue(
            form, 
            'deck_words', 
            toggleValue(chapterID, form.deck_words.value)
        ));
    }
    

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
                    <div className="mt-1 flex flex-col gap-y-6">
                        {props.books.map((book, i) => (
                            <div 
                                key={i}
                                className="flex flex-col gap-y-2 "
                            >
                                <div className="flex justify-between items-center">
                                    <p className="text-sm text-neutral-200 font-medium">
                                        {book.book_name}
                                    </p>
                                    {/* <div className="w-5 aspect-square flex justify-center items-center bg-blue-600 border border-blue-500 rounded-full">
                                        <ChevronDownIcon
                                            size={14}
                                            strokeWidth={2}
                                            className="scale-x-80 stroke-neutral-100"
                                        />
                                    </div> */}
                                </div>
                                {(bookToChaptersToWords?.[book.book_id] || []).length === 0 &&
                                    <div className="bg-neutral-800 w-full h-fit px-4 py-2 bg-neutral-900 rounded-md">
                                        <p className="text-center text-sm font-medium- text-neutral-400">
                                            No Chapters (or Words)
                                        </p>
                                    </div>
                                }
                                {(bookToChaptersToWords?.[book.book_id] || []).map(([chapter, words], i) => (
                                    <div 
                                        key={i}
                                        className={clsx(
                                            "px-2 py-2 flex flex-col gap-y-2 bg-neutral-900 border border-neutral-800 shadow-md rounded-lg",
                                            // words.length === 0 ? "gap-y-4" : "gap-y-2"
                                        )}
                                    >
                                        <p className="text-neutral-200 text-sm">
                                            <span className="w-full block px-2 py-[2px] bg-neutral-800 border border-neutral-700 rounded-md shadow text-sm text-neutral-200">
                                                Chapter {chapter.chapter_number}: {chapter.chapter_title}
                                            </span>
                                        </p>
                                        {words.length === 0 &&
                                            <div className="w-full h-fit px-4 py-2 bg-neutral-950/50 rounded-md">
                                                <p className="text-center text-sm font-medium- text-neutral-400">
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
                <Button
                    label="Create Deck"
                    outerClassName="!w-full"
                    onClick={() => onUpdateDeck(form)}
                />
            </div>
        </Panel>
    )
}