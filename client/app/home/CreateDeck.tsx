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

                console.log(booksToChaptersToWords);
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
        <div>
            <InputText
                label="Deck Name"
                value={form.deck_name.value}
                onChange={value => setForm(updateFormValue(form, 'deck_name', value))}
            />
            {props.books.map((book, i) => (
                <div 
                    key={i}
                    className="flex flex-col gap-y-2"
                >
                    <h3 className="text-white">
                        <b>{book.book_name}</b>
                    </h3>
                    {bookToChaptersToWords[book.book_id].map(([chapter, words], i) => (
                        <div key={i}>
                            <h4 className="text-gray-500">
                                <b>{chapter.chapter_title}</b>
                            </h4>
                            <InputCheckboxes
                                value={form.deck_words.value}
                                options={words.map(word => ({
                                    value: word.word_id,
                                    textLabel: word.word[0]
                                }))}
                                onChange={onToggleChapter}
                            />
                        </div>
                    ))}
                </div>
            ))}
            <Button
                label="Create Deck"
                onClick={() => onCreateDeck(form)}
            />
        </div>
    )
}