import Button from "@/components/Button";
import InputText from "@/components/input/InputText";
import { BookType, getBookChapters } from "@/services/db/book";
import { ChapterType } from "@/services/db/chapter";
import { createDeck, DeckType } from "@/services/db/deck";
import { createForm, getFormData, testForm, updateFormValue } from "@/utilities/form";
import clsx from "clsx";
import { useEffect, useState } from "react";
import z from "zod";

interface CreateDeckProps {
    books: BookType[];
    onClose: () => void;
    onDeckCreated: (deck: DeckType) => void;
}

interface BookChapters {[bookID: number]: ChapterType[]}

export default function CreateDeck(props: CreateDeckProps) {
    const [bookChapters, setBookChapters] = useState<BookChapters>();
    const [form, setForm] = useState(createForm([
        {
            label: 'deck_name',
            value: '',
            test: z.any()
        },
        {
            label: 'deck_chapters',
            value: [],
            test: z.any()
        }
    ]));


    useEffect(() => {
        const load = async () => {
            const bookChapters = await loadBookChapters(props.books);
            setBookChapters(bookChapters);
        }
        load();
    }, [props.books]);


    const loadBookChapters = async (books: BookType[]) => {
        const bookChapters: BookChapters = {};
        for (const book of books) {
            const chapters = await getBookChapters(book.book_id);
            if (!chapters) {
                alert('Failed to Get Book\'s Chapters');
                continue;
            }
            bookChapters[book.book_id] = chapters;
        }
        return bookChapters;
    }


    const onCreateDeck = async (deck: DeckType) => {
        const createdDeck = await createDeck({
            deck_id: -1,
            deck_name: deck.deck_name,
            deck_chapters: deck.deck_chapters,
            reader_id: "",
        });

        if (!createdDeck || !createdDeck.length) {
            alert('Failed to Create Deck');
            return;
        }

        props.onDeckCreated(createdDeck[0]);
    }

    
    return (
        <div>
            <InputText
                label={"Deck Name"}
                value={form.deck_name.value}
                onChange={(value: string) => setForm(updateFormValue(form, 'deck_name', value))}
            />
            {props.books.map((book, i) => (
                <div 
                    key={i}
                    className="flex flex-col gap-y-2"
                >
                    <h3><b>{book.book_name}</b></h3>
                    {(bookChapters && bookChapters[book.book_id]) && bookChapters[book.book_id].map((chapter, j) => (
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
                    onCreateDeck(getFormData(form));
                }}
            />
        </div>
    )
}