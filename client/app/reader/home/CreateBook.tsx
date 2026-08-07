"use client";
import { useState } from "react"
import { BookType, CreateBookType, insertBook } from "@/services/server/book";
import InputText from "@/components/input/InputText";
import InputTags from "@/components/input/InputTag/InputTags";
import Panel from "@/components/Panel";
import { createForm, Form, getFormData, testForm, updateFormValue, updateFormValues } from "@/utilities/form";
import z from "zod";
import InputImageURL from "@/components/input/InputImageURL";
import SearchBooks from "./SearchBooks";
import { addValue, deleteValue } from "@/utilities/array";
import Button from "@/components/Button";
import { toast } from "@/components/ui/toast/Toast";


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
            value: "",
            test: z.preprocess(
                (val) => (val === "" ? undefined : val),
                z.coerce
                    .number("Must enter a valid year.")
                    .min(1000, "Must enter a year between 1000 and 3000.")
                    .max(3000, "Must enter a year between 1000 and 3000.")
                    .optional()
            )
        },
        {
            label: "book_author",
            value: [],
            test: z.preprocess(
                (val) => (val === "" ? undefined : val),
                z.array(
                    z.string().trim().min(1, "Must enter a name for the author.")
                ).optional()
            )
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
    
    
    const onCreateBook = async (form: Form<CreateBookType>) => {
        try {
            if (!testForm(form, setForm))
                return;

            const data = getFormData(form);
            const inserted = await insertBook(data);
            props.onBookCreated(inserted[0]);
        }
        catch (err) {
            toast({
                type: 'error',
                title: 'Failed to Create',
                description: `The book was unable to be created. Please try again.`
            });
        }
    }


    return (
        <Panel
            title="Create Book"
            onClose={props.onClose}
        >
            <div className="px-8 py-6 flex flex-col gap-y-6">
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
                    buttonClassName="!bg-neutral-900 !border-neutral-800"
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
                    outerClassName="!w-full"
                    onClick={() => onCreateBook(form)}
                />
            </div>
        </Panel>
    )
}