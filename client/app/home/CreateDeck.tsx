import Button from "@/components/Button";
import InputText from "@/components/input/InputText";
import { BookType, selectBookChapters } from "@/services/server/book";
import { insertDeck, DeckType, CreateDeckType } from "@/services/server/deck";
import { createForm, Form, getFormData, testForm, updateFormValue } from "@/utilities/form";
import { useEffect, useState } from "react";
import z from "zod";
import InputCheckboxes from "@/components/input/InputCheckbox/InputCheckboxes";
import { toggleValue } from "@/utilities/arrays";
import { ChapterType } from "@/services/server/chapter";


interface CreateDeckProps {
    books: BookType[];
    onClose: () => void;
    onDeckCreated: (deck: DeckType) => void;
}


export default function CreateDeck(props: CreateDeckProps) {
    const [bookToChapters, setBookToChapters] = useState<{[bookID: number]: ChapterType[]}>(); 
    const [form, setForm] = useState<Form<CreateDeckType>>(createForm([
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

    
    const onCreateDeck = async (form: Form<CreateDeckType>) => {
        try {
            if (!testForm(form))
                throw new Error('Invalid Form');

            const deck = getFormData(form);
            const output = await insertDeck(deck);
            props.onDeckCreated(output.deck);
        }
        catch (error) {
            alert(error);
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
                label="Deck Name"
                value={form.deck_name.value}
                onChange={value => setForm(updateFormValue(form, 'deck_name', value))}
            />
            {props.books.map((book) => (
                <div 
                    key={book.book_id}
                    className="flex flex-col gap-y-2"
                >
                    <h3>
                        <b>
                            {book.book_name}
                        </b>
                    </h3>
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
                label="Create Deck"
                onClick={() => onCreateDeck(form)}
            />
        </div>
    )
}