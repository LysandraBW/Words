import Button from "@/components/Button";
import InputText from "@/components/input/InputText";
import { BookType, getBookChapters } from "@/services/db/book";
import { ChapterType } from "@/services/db/chapter";
import { DeckCardType, DeckType, updateDeck } from "@/services/db/deck"
import { createForm, getFormData, testForm, updateFormValue } from "@/utilities/form";
import clsx from "clsx";
import { useEffect, useState } from "react";
import z from "zod";

interface UpdateDeckProps {
    deck: DeckType;
    books: BookType[];
    onClose: () => void;
    onDeckUpdated: (deck: DeckType, deckCards: DeckCardType[] | null) => void;
}

interface BookChapters {[bookID: number]: ChapterType[]}

export default function UpdateDeck(props: UpdateDeckProps) {
    const [bookChapters, setBookChapters] = useState<BookChapters>();
    const [form, setForm] = useState(createForm([
        {
            label: 'deck_name',
            value: props.deck.deck_name,
            test: z.any()
        },
        {
            label: 'deck_chapters',
            value: props.deck.deck_chapters,
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
    

    const onUpdateDeck = async (deck: DeckType) => {
        const oldDeckChapters = new Set(props.deck.deck_chapters || []);
        const newDeckChapters = new Set(deck.deck_chapters || []);
        const chaptersNotUpdated = oldDeckChapters.size === newDeckChapters.size && [...oldDeckChapters].every(value => newDeckChapters.has(value));

        // Nothing to Update
        if (props.deck.deck_name === deck.deck_name && chaptersNotUpdated) {
            props.onClose();
            return;
        }

        const updatedDeck = await updateDeck({
            reader_id: '',
            deck_id: props.deck.deck_id,
            deck_name: deck.deck_name,
            deck_chapters: chaptersNotUpdated ? null : deck.deck_chapters
        });

        console.log(updatedDeck);
        
        if (!updatedDeck || (chaptersNotUpdated && updatedDeck.length !== 1) || (!chaptersNotUpdated && updatedDeck.length !== 2)) {
            alert('Failed to Create Deck');
            return;
        }

        const [decks, deckCards] = updatedDeck;
        props.onDeckUpdated(decks[0], deckCards || null);
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
                label="Update Deck"
                onClick={() => {
                    if (!testForm(form)) {
                        alert('Form Incorrect');
                        return;
                    }
                    onUpdateDeck(getFormData(form));
                }}
            />
        </div>
    )
}