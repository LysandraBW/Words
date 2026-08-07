import Button from "@/components/Button";
import InputDropdown from "@/components/input/InputDropdown";
import InputText from "@/components/input/InputText";
import Panel from "@/components/Panel";
import { BookType } from "@/services/server/book";
import { ChapterType, CreateChapterType, insertChapter } from "@/services/server/chapter";
import { createForm, Form, getFormData, testForm, updateFormValue } from "@/utilities/form";
import { useState } from "react";
import z from "zod";


interface CreateChapterProps {
    onClose: () => void;
    onChapterCreated: (chapter: ChapterType) => void;
    books: BookType[];
}


export default function CreateChapter(props: CreateChapterProps) {
    const [form, setForm] = useState<Form<ChapterType>>(createForm([
        {
            label: 'chapter_title',
            value: '',
            test: z.string().trim().min(1, "Must enter a name")
        },
        {
            label: 'book_id',
            value: [],
            test: z.number()
        }
    ]));


    const onCreateChapter = async (form: Form<CreateChapterType>) => {
        try {
            if (!testForm(form))
                throw new Error('Invalid Form');

            const data = getFormData(form);
            const inserted = await insertChapter(data);
            props.onChapterCreated(inserted);
        }
        catch (error) {
            alert(error);
        }
    }


    return (
        <Panel
            title="Create Chapter"
            onClose={props.onClose}
        >
            <div className="px-8 py-4 pb-8 flex flex-col gap-y-6">
                <InputDropdown
                    label="Book"
                    toggleLabel={props.books?.find(book => book.book_id === Number(form.book_id.value))?.book_name}
                    value={[form.book_id.value]}
                    options={props.books?.map(book => ({
                        value: book.book_id,
                        textLabel: book.book_name,
                        optionLabel: (
                            <div className="overflow-clip text-inherit">
                                <span className="block truncate text-inherit group-hover:text-blue-400 text-sm font-medium">
                                    {book.book_name}
                                </span>
                                <span className="block text-xs text-neutral-500">
                                    {book.book_year || "No Date Listed"}, {`By ${book.book_author.join(', ')}` || "No Publisher Listed"}
                                </span>
                            </div>
                        )
                    }))}
                    onChange={(value) => setForm(updateFormValue(form, "book_id", value))}
                    error={form.book_id.error}
                />
                <InputText
                    label="Name"
                />
                <Button
                    label="Create Chapter"
                    outerClassName="!w-full"
                    onClick={() => onCreateChapter(form)}
                />
            </div>
        </Panel>
    )
}