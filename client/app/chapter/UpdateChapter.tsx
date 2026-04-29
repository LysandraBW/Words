import Button from "@/components/Button";
import InputText from "@/components/input/InputText";
import { ChapterType, updateChapter } from "@/services/server/chapter";
import { createForm, Form, getFormData, testForm, updateFormValue } from "@/utilities/form";
import { useState } from "react";
import z from "zod";

interface UpdateChapterProps {
    chapter: ChapterType;
    onClose: () => void;
    onChapterUpdated: (chapter: ChapterType) => void;
}

export default function UpdateChapter(props: UpdateChapterProps) {
    const [form, setForm] = useState(createForm([
        {
            label: "book_id",
            value: props.chapter.book_id,
            test: z.number()
        },
        {
            label: "chapter_id",
            value: props.chapter.chapter_id,
            test: z.number()
        },
        {
            label: 'chapter_title',
            value: props.chapter.chapter_title,
            test: z.string().min(1, "Must enter a title.")
        },
        {
            label: 'chapter_number',
            value: props.chapter.chapter_number,
            test: z.coerce.number("Must enter a valid number.")
        }
    ]));


    const onUpdateChapter = async (form: Form<ChapterType>) => {
        try {
            if (!testForm(form)) 
                throw new Error('Failed to Update Chapter');

            const chapter = getFormData(form);
            const updatedChapter = await updateChapter(chapter);
            props.onChapterUpdated(updatedChapter);            
        }
        catch (err) {
            alert(err);
        }
    }


    return (
        <div>
            <InputText
                label="#"
                value={form.chapter_number.value}
                error={form.chapter_number.error}
                onChange={(value: string) => setForm(updateFormValue(form, "chapter_number", value))}
                inputClassName="text-center"
            />
            <InputText
                label="Title"
                value={form.chapter_title.value}
                error={form.chapter_title.error}
                onChange={(value: string) => setForm(updateFormValue(form, "chapter_title", value))}
            />
            <Button
                label="Save Changes"
                onClick={() => onUpdateChapter(form)}
            />
        </div>
    )
}