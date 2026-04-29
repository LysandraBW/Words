import Button from "@/components/Button";
import InputText from "@/components/input/InputText";
import { BookType } from "@/services/server/book";
import { ChapterType, insertChapter, deleteChapter, updateChapter } from "@/services/server/chapter";
import { createForm, Form, getFormData, resetForm, testForm, updateFormValue } from "@/utilities/form";
import { PlusIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";
import z from "zod";


// Newly created chapters are given a fake ID.
// As negative IDs aren't used, we can
// safely take advantage of them. Anyway, this
// variable stored the next available ID.
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


interface UpdateChaptersProps {
    book: BookType;
    chapters: ChapterType[];
    onClose: () => void;
    onChaptersUpdated: (chapters: ChapterType[]) => void;
}


export default function UpdateChapters(props: UpdateChaptersProps) {
    // Form
    // This form contains the new chapter the user is
    // creating (or can create).
    const [form, setForm] = useState<ChapterForm>(createChapterForm(props.book.book_id, chapterID, "", ""));
    
    // Forms
    // These forms contain the existing chapters or the
    // chapters that the user has created.
    const [forms, setForms] = useState<ChapterForms>(Object.fromEntries(props.chapters.map(chapter => [
        String(chapter.chapter_id), 
        createChapterForm(
            props.book.book_id, 
            chapter.chapter_id, 
            chapter.chapter_title, 
            chapter.chapter_number
        )
    ])));

    
    // Update Form
    // This updates a single form,
    // and then updates the forms variable
    // that contains said form.
    const updateChapterForm = (params: {
        id: string;
        form: ChapterForm;
        forms: ChapterForms; 
        label: keyof ChapterForm;
        value: ChapterType[keyof Form<ChapterType>]
    }) => {
        if (!Object.keys(form).includes(params.label))
            return forms;
        return {...forms, [params.id]: updateFormValue(form, params.label, params.value, true)}
    }


    // Delete Form
    // This deletes a single form,
    // and then updates the forms variable
    // that contains said form.
    const deleteChapterForm = (forms: ChapterForms, id: string) => {
        const updatedForms = {...forms};
        delete updatedForms[id];
        return updatedForms;
    }


    // Insert Form
    // This insert a single form
    // into the forms variable. Why?
    // The forms variable contains all
    // the chapters that exist or will exist.
    const insertChapterForm = (forms: ChapterForms, id: string, form: ChapterForm) => {
        return {
            ...forms,
            [id]: createChapterForm(
                props.book.book_id, 
                Number(id), 
                form.chapter_title.value, 
                form.chapter_number.value
            )
        };
    }


    const onUpdateChapters = async (oldChapters: ChapterType[], newChapters: ChapterForms) => {
        const chapters: ChapterType[] = [];

        try {
            if (!Object.values(newChapters).every(chapter => testForm(chapter)))
                throw new Error('Invalid Form');

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

                if (!oldChapterData || !newChapterData)
                    throw new Error('Cannot Find Old or New Chapters');

                // No Changes Made
                if (
                    (oldChapterData.chapter_title === newChapterData.chapter_title) && 
                    (oldChapterData.chapter_number === newChapterData.chapter_number)
                ) continue;

                const chapter = await updateChapter(newChapterData);
                chapters.push(chapter);

                oldChapterIDs.delete(id);
                newChapterIDs.delete(id);
            }


            // Intersecting Chapter Numbers 
            // -> Update
            const updateChapterNumbers = oldChapterNumbers.intersection(newChapterNumbers);
            for (const number of updateChapterNumbers) {
                const oldChapter = oldChapters.find(chapter => chapter.chapter_number === number);
                const newChapter = Object.values(newChapters).find(chapter => chapter.chapter_number.value === number);

                if (!oldChapter || !newChapter) 
                    throw new Error('Cannot Find Old or New Chapters');

                const newChapterData = getFormData(newChapter);
                newChapterData.chapter_id = oldChapter.chapter_id;

                // No Changes Made
                if (
                    (oldChapter.chapter_title === newChapterData.chapter_title) && 
                    (oldChapter.chapter_number === newChapterData.chapter_number)
                ) continue;

                const chapter = await updateChapter(newChapterData);
                chapters.push(chapter);

                oldChapterIDs.delete(oldChapter.chapter_id);
                newChapterIDs.delete(newChapter.chapter_id.value);
            }


            // Delete
            const deleteChapterIDs = oldChapterIDs.difference(newChapterIDs);
            for (const id of deleteChapterIDs) {
                await deleteChapter(id);
            }


            // Create
            const createChapterIDs = newChapterIDs.difference(oldChapterIDs);
            for (const id of createChapterIDs) {
                const chapter = getFormData(newChapters[id])
                const createdChapter = await insertChapter(chapter);
                chapters.push(createdChapter);
            }
            
            props.onChaptersUpdated(chapters);
        }
        catch (err) {
            alert(err);
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
                        onChange={(value: string) => setForms(forms => updateChapterForm({
                            forms, 
                            id: formID, 
                            form, 
                            label: "chapter_number", 
                            value
                        }))}
                        inputClassName="text-center"
                    />
                    <InputText
                        label="Title"
                        value={form.chapter_title.value}
                        error={form.chapter_title.error}
                        onChange={(value: string) => setForms(forms => updateChapterForm({
                            forms, 
                            id: formID, 
                            form, 
                            label: "chapter_title", 
                            value
                        }))}
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