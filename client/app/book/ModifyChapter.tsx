import InputText from "@/components/input/InputText";
import { ChapterType } from "@/services/db/chapter";
import { createForm, Form, updateForm } from "@/utilities/form";
import { PlusIcon, Trash2, Trash2Icon } from "lucide-react";
import { useState } from "react";
import z from "zod";

interface ModifyChaptersProps {
    chapters: ChapterType[];
    onClose: () => void;
    onCreate: (chapter: ChapterType) => void;
    onUpdate: (chapter: ChapterType) => void;
    onDelete: (chapter: ChapterType) => void;
}

let chapterID = -1;

export default function ModifyChapters(props: ModifyChaptersProps) {
    const [forms, setForms] = useState<{[id: string]: Form<ChapterType>}>(Object.fromEntries(props.chapters
        .map(chapter => [chapter.chapter_id + "", createForm([
            {
                label: "chapter_title",
                value: chapter.chapter_title,
                test: z.string().min(1)
            },
            {
                label: "chapter_number",
                value: chapter.chapter_number,
                test: z.coerce.number()
            }
        ])
    ])));

    const [chapterTitle, setChapterTitle] = useState("");
    const [chapterNumber, setChapterNumber] = useState("");

    const updateFormInForms = (forms: {[id: string]: Form<ChapterType>}, id: string, form: Form<ChapterType>, label: keyof Form<ChapterType>, value: ChapterType[keyof Form<ChapterType>]) => {
        if (!Object.keys(form).includes(label))
            return forms;
        return {...forms, [id]: updateForm(form, label, value)}
    }

    const deleteFormInForms = (forms: {[id: string]: Form<ChapterType>}, id: string) => {
        const updatedForms = {...forms};
        delete updatedForms[id];
        return updatedForms;
    }

    const insertFormInForms = (forms: {[id: string]: Form<ChapterType>}, id: string, title: string, number: string) => {
        return {
            ...forms,
            [id]: createForm([
                {
                    label: "chapter_title",
                    value: title,
                    test: z.string().min(1)
                },
                {
                    label: "chapter_number",
                    value: number,
                    test: z.coerce.number()
                }
            ])
        };
    }


    return (
        <div>
            <h5>
                Modify Chapters
            </h5>
            {Object.entries(forms).sort((a, b) => parseInt(a[1].chapter_number.value) - parseInt(b[1].chapter_number.value)).map(([formID, form], i) => (
                <div 
                    key={i}
                    className="grid grid-cols-[32px_1fr_32px] gap-x-1"
                >
                    <InputText
                        label="#"
                        value={form.chapter_number.value}
                        error={form.chapter_number.error}
                        onChange={(value: string) => setForms(forms => updateFormInForms(forms, formID, form, "chapter_number", value))}
                    />
                    <InputText
                        label="Title"
                        value={form.chapter_title.value}
                        error={form.chapter_title.error}
                        onChange={(value: string) => setForms(forms => updateFormInForms(forms, formID, form, "chapter_title", value))}
                    />
                    <div 
                        onClick={() => setForms(forms => deleteFormInForms(forms, formID))}
                        className="w-full aspect-square rounded-md bg-black"
                    >
                        <Trash2Icon
                            size={16}
                            className="text-white"
                        />
                    </div>
                </div>
            ))}
            <div 
                className="grid grid-rows-1 grid-cols-[32px_1fr_36px] items-end gap-x-1"
            >
                <InputText
                    label="#"
                    value={chapterNumber}
                    onChange={setChapterNumber}
                />
                <InputText
                    label="Title"
                    value={chapterTitle}
                    onChange={setChapterTitle}
                />
                <div 
                    onClick={() => {
                        setForms(forms => insertFormInForms(forms, chapterID-- + "", chapterTitle, chapterNumber));
                        setChapterNumber("");
                        setChapterTitle("");
                    }}
                    className="w-full aspect-square rounded-md bg-black"
                >
                    <PlusIcon
                        size={16}
                        className="text-white"
                    />
                </div>
            </div>
        </div>
    )
}