"use client";
import { useEffect, useState } from "react"
import { BookType, updateBook } from "@/services/db/books"
import InputText from "@/components/input/InputText";
import InputTags from "@/components/input/InputTag/InputTags";
import { createForm, Form, getFormData, updateFormValue } from "@/utilities/form";
import z from "zod";
import InputImageURL from "@/components/input/InputImageURL";
import Button from "@/components/Button";
import Modal from "@/components/Modal";

interface UpdateBookProps {
    book: BookType;
    onClose: () => void;
    onUpdate: (book: BookType) => void;
}

export default function UpdateBook(props: UpdateBookProps) {
    const [form, setForm] = useState<Form<BookType>>(createForm([
        {
            label: "book_id",
            value: props.book.book_id,
            test: z.any()
        },
        {
            label: "book_name",
            value: props.book.book_name,
            test: z.string().min(1, "Must enter the name of a book.")
        },
        {
            label: "book_cover_image",
            value: props.book.book_cover_image,
            test: z.url("Must enter a valid URL.")
        },
        {
            label: "book_background_image",
            value: props.book.book_background_image,
            test: z.url("Must enter a valid URL.")
        },
        {
            label: "book_year",
            value: props.book.book_year,
            test: z.coerce.number("Must enter a valid year.")
            .min(1000, "Must enter a year greater than 1000.")
            .max(3000, "Must enter a year less than 3000.")
        },
        {
            label: "book_author",
            value: props.book.book_author,
            test: z.array(z.string().min(1, "Authors must have a name."))
        }
    ]));


    const onInsertAuthor = (value: string) => {
        const authors = new Set(form.book_author.value || []);
        authors.add(value);
        return [...authors];
    }


    const onDeleteAuthor = (value: string) => {
        const authors = new Set(form.book_author.value || []);
        authors.delete(value);
        return [...authors];
    }


    const onUpdateBook = async (book: BookType) => {
        const updatedBook = await updateBook({
            book_id: book.book_id,
            reader_id: '',
            book_name: book.book_name,
            book_year: book.book_year,
            book_author: book.book_author || null,
            book_background_image: book.book_background_image || null,
            book_cover_image: book.book_cover_image || null
        });
                
        if (updatedBook)
            props.onUpdate(updatedBook[0]);
    }

   
    useEffect(() => {
        console.log(props.book);
    }, [])


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
                    onDelete={(value) => setForm(updateFormValue(form, "book_author", onDeleteAuthor(value)))}
                    onInsert={(value) => setForm(updateFormValue(form, "book_author", onInsertAuthor(value)))}
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
                    onClick={() => onUpdateBook(getFormData(form))}
                />
            </div>
        </Modal>
    )
}