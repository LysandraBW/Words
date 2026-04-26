import Button from "@/components/Button";
import InputText from "@/components/input/InputText";
import { BookType } from "@/services/db/book";
import { ChapterType, createChapter, deleteChapter, updateChapter } from "@/services/db/chapter";
import { createForm, Form, getFormData, resetForm, testForm, updateFormValue } from "@/utilities/form";
import { PlusIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";
import z from "zod";

interface UpdateChaptersProps {
    book: BookType;
    chapters: ChapterType[];
    onClose: () => void;
}

let chapterID = -1;

const createChapterForm = (bookID: number, chapterID: number, chapterTitle: string, chapterNumber: string) => {
    return createForm([
        {
            label: "book_id",
            value: bookID,
            test: z.number()
        },
        {
            label: "chapter_id",
            value: chapterID,
            test: z.number()
        },
        {
            label: "chapter_title",
            value: chapterTitle,
            test: z.string().min(1, "Must enter a title.")
        },
        {
            label: "chapter_number",
            value: chapterNumber,
            test: z.coerce.number("Must enter a valid number.")
        }
    ]);
}

type ChapterForm = Form<ChapterType>;
type ChapterForms = {[id: string]: ChapterForm};

export default function UpdateChapters(props: UpdateChaptersProps) {
    const [form, setForm] = useState<ChapterForm>(createChapterForm(props.book.book_id, chapterID, "", ""));
    const [forms, setForms] = useState<ChapterForms>(Object.fromEntries(props.chapters.map(chapter => [String(chapter.chapter_id), createChapterForm(props.book.book_id, chapter.chapter_id, chapter.chapter_title, chapter.chapter_number)])));


    const updateChapterForm = (forms: ChapterForms, id: string, form: ChapterForm, label: keyof ChapterForm, value: ChapterType[keyof Form<ChapterType>]) => {
        if (!Object.keys(form).includes(label))
            return forms;
        return {...forms, [id]: updateFormValue(form, label, value, true)}
    }


    const deleteChapterForm = (forms: ChapterForms, id: string) => {
        const updatedForms = {...forms};
        delete updatedForms[id];
        return updatedForms;
    }


    const insertChapterForm = (forms: ChapterForms, id: string, form: ChapterForm) => {
        return {
            ...forms,
            [id]: createChapterForm(props.book.book_id, Number(id), form.chapter_title.value, form.chapter_number.value)
        };
    }


    const onUpdateChapters = async (oldChapters: ChapterType[], newChapters: ChapterForms) => {
        const oldChapterIDs = new Set(oldChapters.map(chapter => chapter.chapter_id));
        const newChapterIDs = new Set(Object.values(newChapters).map(chapter => chapter.chapter_id.value));
        
        const oldChapterNumbers = new Set(oldChapters.map(chapter => chapter.chapter_number));
        const newChapterNumbers = new Set(Object.values(newChapters).map(chapter => chapter.chapter_number.value));

        // Intersecting Chapter IDs 
        // -> Update
        const updateChapterIDs = oldChapterIDs.intersection(newChapterIDs);
        for (const id of updateChapterIDs) {
            const oldChapterData = oldChapters.find(chapter => chapter.chapter_id === id);
            const newChapterData = getFormData(newChapters[id]);

            if (!oldChapterData || !newChapterData) {
                alert('Cannot Find Old or New Chapters');
                return;
            }

            // No Changes Made
            if (
                (oldChapterData.chapter_title === newChapterData.chapter_title) && 
                (oldChapterData.chapter_number === newChapterData.chapter_number)
            ) continue;

            await updateChapter(newChapterData);

            oldChapterIDs.delete(id);
            newChapterIDs.delete(id);
        }

        // Intersecting Chapter Numbers 
        // -> Update
        const updateChapterNumbers = oldChapterNumbers.intersection(newChapterNumbers);
        for (const number of updateChapterNumbers) {
            const oldChapter = oldChapters.find(chapter => chapter.chapter_number === number);
            const newChapter = Object.values(newChapters).find(chapter => chapter.chapter_number.value === number);

            if (!oldChapter || !newChapter) {
                alert('Cannot Find Old or New Chapters')
                continue;
            }

            const newChapterData = getFormData(newChapter);
            newChapterData.chapter_id = oldChapter.chapter_id;

            // No Changes Made
            if (
                (oldChapter.chapter_title === newChapterData.chapter_title) && 
                (oldChapter.chapter_number === newChapterData.chapter_number)
            ) continue;

            await updateChapter(newChapterData);

            oldChapterIDs.delete(oldChapter.chapter_id);
            newChapterIDs.delete(newChapter.chapter_id.value);
        }

        const deleteChapterIDs = oldChapterIDs.difference(newChapterIDs);
        for (const id of deleteChapterIDs) {
            await deleteChapter(id);
        }

        const createChapterIDs = newChapterIDs.difference(oldChapterIDs);
        for (const id of createChapterIDs) {
            await createChapter(getFormData(newChapters[id]));
        }
    }

    return (
        <div>
            <h5>
                Chapters
            </h5>
            <Button
                onClick={() => onUpdateChapters(props.chapters, forms)}
                label="Save"
                style="blue"
            />
            {Object.entries(forms).sort((a, b) => parseInt(a[1].chapter_number.value) - parseInt(b[1].chapter_number.value)).map(([formID, form], i) => (
                <div 
                    key={formID}
                    className="grid grid-rows-1 grid-cols-[64px_1fr_36px] items-end gap-x-1"
                >
                    <InputText
                        label="#"
                        value={form.chapter_number.value}
                        error={form.chapter_number.error}
                        onChange={(value: string) => setForms(forms => updateChapterForm(forms, formID, form, "chapter_number", value))}
                        inputClassName="text-center"
                    />
                    <InputText
                        label="Title"
                        value={form.chapter_title.value}
                        error={form.chapter_title.error}
                        onChange={(value: string) => setForms(forms => updateChapterForm(forms, formID, form, "chapter_title", value))}
                    />
                    <div 
                        onClick={() => setForms(forms => deleteChapterForm(forms, formID))}
                        className="w-full aspect-square flex justify-center items-center rounded-md bg-black"
                    >
                        <Trash2Icon
                            size={16}
                            className="text-white"
                        />
                    </div>
                </div>
            ))}
            <div 
                className="grid grid-rows-1 grid-cols-[64px_1fr_36px] items-end gap-x-1"
            >
                <InputText
                    label="#"
                    value={form.chapter_number.value}
                    error={form.chapter_number.error}
                    onChange={(value) => setForm(updateFormValue(form, "chapter_number", value))}
                    inputClassName="text-center"
                />
                <InputText
                    label="Title"
                    value={form.chapter_title.value}
                    error={form.chapter_title.error}
                    onChange={(value) => setForm(updateFormValue(form, "chapter_title", value))}
                />
                <div 
                    onClick={() => {
                        if (!testForm(form))
                            return;
                        setForms(forms => insertChapterForm(forms, String(chapterID--), form));
                        setForm(resetForm(form));
                    }}
                    className="w-full aspect-square flex justify-center items-center rounded-md bg-black"
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