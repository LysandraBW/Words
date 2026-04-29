"use client";
import { useState } from "react"
import { BookType, CreateBookType, insertBook } from "@/services/db/book";
import InputText from "@/components/input/InputText";
import InputTags from "@/components/input/InputTag/InputTags";
import Panel from "@/components/Panel";
import { createForm, Form, getFormData, testForm, updateFormValue, updateFormValues } from "@/utilities/form";
import z from "zod";
import InputImageURL from "@/components/input/InputImageURL";
import Button from "@/components/Button";
import SearchBooks from "./SearchBooks";
import { addValue, deleteValue } from "@/utilities/arrays";


interface CreateBookProps {
    onClose: () => void;
    onBookCreated: (book: BookType) => void;
}


export default function CreateBook(props: CreateBookProps) {
    const [form, setForm] = useState<Form<CreateBookType>>(createForm([
        {
            label: "book_name",
            value: "",
            test: z.string().trim().min(1, "Must enter a name.")
        },
        {
            label: "book_year",
            value: 1999,
            test: z.coerce
                .number("Must enter a valid year.")
                .min(1000, "Must enter a year between 1000 and 3000.")
                .max(3000, "Must enter a year between 1000 and 3000.")
        },
        {
            label: "book_author",
            value: [],
            test: z.array(z.string().trim().min(1, "Must enter a name for the author."))
        },
        {
            label: "book_cover_image",
            value: "",
            test: z.union([
                z.literal(""),
                z.url("Must enter a valid URL.")
            ])
        },
        {
            label: "book_background_image",
            value: "",
            test: z.union([
                z.literal(""),
                z.url("Must enter a valid URL.")
            ])
        },
    ]));
    
    
    const createBook = async (book: CreateBookType) => {
        const createdBook = await insertBook(book);
        if (!createdBook)
            throw new Error('Failed to Create Book');
        return createdBook;
    }

    
    const onCreateBook = async (form: Form<CreateBookType>) => {
        try {
            if (!testForm(form))
                throw new Error('Invalid Form');

            const book = getFormData(form);
            const createdBook = await createBook(book);
            props.onBookCreated(createdBook);
        }
        catch (error) {
            alert((error as Error).message);
        }
    }


    return (
        <Panel
            title="Create Book"
            onClose={props.onClose}
        >
            <div className="px-8 py-4 flex flex-col gap-y-4">
                <SearchBooks
                    onClickBook={(book: CreateBookType) => setForm(updateFormValues(form, book, true))}
                />
                <InputText
                    label="Name"
                    value={form.book_name.value}
                    onChange={(value) => setForm(updateFormValue(form, "book_name", value))}
                    required={true}
                    error={form.book_name.error}
                />
                <InputText
                    label="Year Published"
                    value={form.book_year.value}
                    onChange={(value) => setForm(updateFormValue(form, "book_year", value))}
                    error={form.book_year.error}
                />
                <InputTags
                    label="Author"
                    value={form.book_author.value}
                    onDelete={(value) => setForm(updateFormValue(form, "book_author", deleteValue(value, form.book_author.value)))}
                    onInsert={(value) => setForm(updateFormValue(form, "book_author", addValue(value, form.book_author.value)))}
                    error={form.book_author.error}
                />
                <InputImageURL
                    label="Cover Image"
                    value={form.book_cover_image.value || ""}
                    onChange={(value) => setForm(updateFormValue(form, "book_cover_image", value))}
                    error={form.book_cover_image.error}
            />
                <InputImageURL
                    label="Background Image"
                    value={form.book_background_image.value || ""}
                    onChange={(value) => setForm(updateFormValue(form, "book_background_image", value))}
                    error={form.book_background_image.error}
                />
                <Button
                    label="Create Book"
                    style="blue"
                    onClick={() => onCreateBook(form)}
                />
            </div>
        </Panel>
    )
}