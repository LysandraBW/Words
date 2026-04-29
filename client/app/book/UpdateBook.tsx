"use client";
import { useState } from "react"
import { BookType, updateBook, UpdateBookType } from "@/services/server/book"
import InputText from "@/components/input/InputText";
import InputTags from "@/components/input/InputTag/InputTags";
import { createForm, Form, getFormData, testForm, updateFormValue } from "@/utilities/form";
import z from "zod";
import InputImageURL from "@/components/input/InputImageURL";
import Button from "@/components/Button";
import Modal from "@/components/Modal";
import { addValue, deleteValue } from "@/utilities/array";


interface UpdateBookProps {
    book: BookType;
    onClose: () => void;
    onBookUpdated: (book: BookType) => void;
}


export default function UpdateBook(props: UpdateBookProps) {
    const [form, setForm] = useState<Form<UpdateBookType>>(createForm([
        {
            label: "book_id",
            value: props.book.book_id,
            test: z.number()
        },
        {
            label: "book_name",
            value: props.book.book_name,
            test: z.string().trim().min(1, "Must enter the name of a book.")
        },
        {
            label: "book_cover_image",
            value: props.book.book_cover_image,
            test: z.union([
                z.literal(""),
                z.url("Must enter a valid URL.")
            ])
        },
        {
            label: "book_background_image",
            value: props.book.book_background_image,
            test: z.union([
                z.literal(""),
                z.url("Must enter a valid URL.")
            ])
        },
        {
            label: "book_year",
            value: props.book.book_year,
            test: z.coerce.number("Must enter a year between 1000 and 3000.")
            .min(1000, "Must enter a year between 1000 and 3000.")
            .max(3000, "Must enter a year between 1000 and 3000.")
        },
        {
            label: "book_author",
            value: props.book.book_author,
            test: z.array(z.string().min(1, "Authors must have a name."))
        }
    ]));


    const onUpdateBook = async (form: Form<UpdateBookType>) => {
        try {
            if (!testForm(form))
                throw new Error('Invalid Form');

            const book = getFormData(form);
            const updatedBook = await updateBook(book);
            props.onBookUpdated(updatedBook);
        }
        catch (error) {
            alert(error);
        }
    }
    

    return (
        <Modal
            title="Update Book"
            onClose={props.onClose}
        >
            <div className="px-8 py-4 flex flex-col gap-y-4">
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
                    label="Update Book"
                    style="blue"
                    onClick={() => onUpdateBook(form)}
                />
            </div>
        </Modal>
    )
}