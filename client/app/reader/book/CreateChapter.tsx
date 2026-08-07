import Button from "@/components/Button";
import InputDropdown from "@/components/input/InputDropdown";
import InputText from "@/components/input/InputText";
import Panel from "@/components/Panel";
import { toast } from "@/components/ui/toast/Toast";
import { BookType } from "@/services/server/book";
import { ChapterType, CreateChapterType, insertChapter } from "@/services/server/chapter";
import { createForm, Form, getFormData, testForm, updateFormValue } from "@/utilities/form";
import { useState } from "react";
import z from "zod";


interface CreateChapterProps {
    onClose: () => void;
    onChapterCreated: (chapter: ChapterType) => void;
    books: BookType[];
    book?: BookType;
}


export default function CreateChapter(props: CreateChapterProps) {
    const [form, setForm] = useState<Form<ChapterType>>(createForm([
        {
            label: 'chapter_title',
            value: '',
            test: z.string().trim().min(1, "Must enter a name.")
        },
        {
            label: 'book_id',
            value: [props.book?.book_id],
            test: z.array(z.number("Must select a book.")).min(1, "Must select a book.")
        }
    ]));


    const onCreateChapter = async (form: Form<ChapterType>) => {
        try {
            console.log('Hi')
            if (!testForm(form, setForm))
                return;

            const data = getFormData(form);
            const inserted = await insertChapter(data);
            props.onChapterCreated(inserted);
            props.onClose();
        }
        catch (error) {
            toast({
                type: 'error',
                title: 'Failed to Create',
                description: `The chapter was unable to be created. Please try again.`
            });
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
                    value={form.book_id.value as any}
                    options={props.books?.map(book => ({
                        value: book.book_id,
                        textLabel: book.book_name,
                        optionLabel: (
                            <div className="overflow-clip text-inherit">
                                <span className="block truncate text-inherit text-sm font-medium">
                                    {book.book_name}
                                </span>
                                <span className="block text-xs text-neutral-500">
                                    {book.book_year || "No Date Listed"}, {`By ${book.book_author.join(', ')}` || "No Publisher Listed"}
                                </span>
                            </div>
                        )
                    }))}
                    onChange={(value) => setForm(updateFormValue(form, "book_id", [value] as any))}
                    error={form.book_id.error}
                />
                <InputText
                    label="Name"
                    onChange={(value: string) => setForm(updateFormValue(form, 'chapter_title', value))}
                    error={form.chapter_title.error}
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