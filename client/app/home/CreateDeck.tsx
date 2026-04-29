import Button from "@/components/Button";
import InputText from "@/components/input/InputText";
import { BookType, selectBookChapters } from "@/services/db/book";
import { ChapterType } from "@/services/db/chapter";
import { insertDeck, DeckType } from "@/services/db/deck";
import { createForm, Form, getFormData, testForm, updateFormValue } from "@/utilities/form";
import clsx from "clsx";
import { useEffect, useState } from "react";
import z from "zod";


interface CreateDeckProps {
    books: BookType[];
    onClose: () => void;
    onDeckCreated: (deck: DeckType) => void;
}


interface BookToChapters {
    [bookID: number]: ChapterType[];
}


export default function CreateDeck(props: CreateDeckProps) {
    const [bookToChapters, setBookToChapters] = useState<BookToChapters>();
    const [form, setForm] = useState<Form<DeckType>>(createForm([
        {
            label: 'deck_name',
            value: '',
            test: z.string().trim().min(1, "Must enter a name")
        },
        {
            label: 'deck_chapters',
            value: [],
            test: z.array(z.number())
        }
    ]));


    useEffect(() => {
        const load = async () => {
            try {
                const bookToChapters = await loadBookToChapters(props.books);
                setBookToChapters(bookToChapters);
            }
            catch (err) {
                alert(err);
            }
        }
        load();
    }, [props.books]);


    const loadBookToChapters = async (books: BookType[]) => {
        const chapters = await Promise.all(books.map(async book => {
            const bookChapters = await selectBookChapters(book.book_id);
            if (!bookChapters)
                throw 'Failed to Load Book\'s Chapters';
            return [book.book_id, bookChapters];
        }));

        const bookToChapters: BookToChapters = Object.fromEntries(chapters);
        return bookToChapters;
    }


    const createDeck = async (deck: DeckType) => {
        const createdDeck = await insertDeck(deck);
        if (!createdDeck)
            throw new Error('Failed to Create Deck');
        return createdDeck;
    }


    const onClickCreateDeck = async (form: Form<DeckType>) => {
        try {
            if (!testForm(form))
                throw new Error('Invalid Form');

            const deck = getFormData(form);
            const output = await createDeck(deck);
            props.onDeckCreated(output.deck);
        }
        catch (error) {
            alert((error as Error).message);
        }
    }

    
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
                    <h3><b>{book.book_name}</b></h3>
                    {(bookToChapters && bookToChapters[book.book_id]) && bookToChapters[book.book_id].map((chapter, j) => (
                        <div 
                            key={j}
                            className={clsx(
                                form.deck_chapters.value.includes(chapter.chapter_id) && "bg-green-500",
                                !form.deck_chapters.value.includes(chapter.chapter_id) && "bg-red-500",
                            )}
                            onClick={() => {
                                if (form.deck_chapters.value.includes(chapter.chapter_id)) {
                                    const updatedDeckChapters = [...form.deck_chapters.value];
                                    updatedDeckChapters.splice(form.deck_chapters.value.findIndex((selectedChapter: number) => selectedChapter === chapter.chapter_id), 1);
                                    setForm(updateFormValue(form, 'deck_chapters', updatedDeckChapters));
                                }
                                else {
                                    const updatedDeckChapters = [...form.deck_chapters.value, chapter.chapter_id];
                                    setForm(updateFormValue(form, 'deck_chapters', updatedDeckChapters));
                                }
                            }}
                        >
                            {chapter.chapter_number}, {chapter.chapter_title}
                        </div>
                    ))}
                </div>
            ))}
            <Button
                label="Create Deck"
                onClick={() => {
                    if (!testForm(form)) {
                        alert('Form Incorrect');
                        return;
                    }
                    onClickCreateDeck(form);
                }}
            />
        </div>
    )
}