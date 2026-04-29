import Button from "@/components/Button";
import InputCheckboxes from "@/components/input/InputCheckbox/InputCheckboxes";
import InputText from "@/components/input/InputText";
import { BookType, selectBookChapters } from "@/services/server/book";
import { ChapterType } from "@/services/server/chapter";
import { DeckType, updateDeck } from "@/services/server/deck"
import { sameArrays, toggleValue } from "@/utilities/array";
import { createForm, Form, getFormData, testForm, updateFormValue } from "@/utilities/form";
import { useEffect, useState } from "react";
import z from "zod";


interface UpdateDeckProps {
    deck: DeckType;
    books: BookType[];
    onClose: () => void;
    onDeckUpdated: (deck: Awaited<ReturnType<typeof updateDeck>>) => void;
}


export default function UpdateDeck(props: UpdateDeckProps) {
    const [bookToChapters, setBookToChapters] = useState<{[bookID: number]: ChapterType[]}>(); 
    const [form, setForm] = useState<Form<DeckType>>(createForm([
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
            try {
                setBookToChapters(
                    Object.fromEntries(
                        await Promise.all(props.books.map(async book => {
                            return [
                                book.book_id,
                                await selectBookChapters(book.book_id)
                            ];
                        }))
                    )
                );
            }
            catch (err) {
                alert(err);
            }
        }
        load();
    }, [props.books]);


    const onUpdateDeck = async (form: Form<DeckType>) => {
        try {
            if (!testForm(form))
                throw new Error('Invalid Form');

            const deck = getFormData(form);
            const chaptersNotUpdated = sameArrays(props.deck.deck_chapters, deck.deck_chapters);
            
            props.onDeckUpdated(await updateDeck({
                deck_id: props.deck.deck_id,
                deck_name: deck.deck_name,
                deck_chapters: chaptersNotUpdated ? null : deck.deck_chapters
            }));
        }
        catch (err) {
            alert(err);
        }
    }


    const onToggleChapter = (chapterID: number) => {
        setForm(form => updateFormValue(
            form, 
            'deck_chapters', 
            toggleValue(chapterID, form.deck_chapters.value)
        ));
    }


    if (!bookToChapters)
        return <>Loading</>;


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
                    <InputCheckboxes
                        value={form.deck_chapters.value}
                        options={(bookToChapters[book.book_id] ?? []).map(chapter => ({
                            value: chapter.chapter_id,
                            textLabel: chapter.chapter_title
                        }))}
                        onChange={onToggleChapter}
                    />
                </div>
            ))}
            <Button
                label="Update Deck"
                onClick={() => onUpdateDeck(form)}
            />
        </div>
    )
}