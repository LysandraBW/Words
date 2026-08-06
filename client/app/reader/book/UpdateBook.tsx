"use client";
import { Fragment, useState } from "react"
import { BookType, updateBook, UpdateBookType } from "@/services/server/book"
import InputText from "@/components/input/InputText";
import InputTags from "@/components/input/InputTag/InputTags";
import { createForm, Form, getFormData, resetForm, testForm, updateFormValue } from "@/utilities/form";
import z from "zod";
import InputImageURL from "@/components/input/InputImageURL";
import Button from "@/components/Button";
import Modal from "@/components/Modal";
import { addValue, deleteValue } from "@/utilities/array";
import Panel from "@/components/Panel";
import InputButton from "@/components/input/InputButton";
import { ChapterType, insertChapter, deleteChapter, updateChapter } from "@/services/server/chapter";
import { PlusIcon, Trash2Icon } from "lucide-react";
import clsx from "clsx";
import MutateChapterInList from "./MutateChapterItem";
import { DragDropProvider } from '@dnd-kit/react';
import { move } from '@dnd-kit/helpers';


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


interface UpdateBookProps {
    book: BookType;
    onClose: () => void;
    onBookUpdated: (book: BookType) => void;
    chapters: ChapterType[];
    onChaptersUpdated: (chapters: ChapterType[]) => void;
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
    

    // Form
    // This form contains the new chapter the user is
    // creating (or can create).
    const [chapterForm, setChapterForm] = useState<ChapterForm>(createChapterForm(props.book.book_id, chapterID, "", ""));
    
    // Forms
    // These forms contain the existing chapters or the
    // chapters that the user has created.
    const [chapterForms, setChapterForms] = useState<ChapterForms>(Object.fromEntries(props.chapters.map(chapter => [
        String(chapter.chapter_id), 
        createChapterForm(
            props.book.book_id, 
            chapter.chapter_id, 
            chapter.chapter_title, 
            chapter.chapter_number
        )
    ])));

    const sortedChapterForms = Object.entries(chapterForms).sort((a, b) => {
        return parseInt(a[1].chapter_number.value) - parseInt(b[1].chapter_number.value);
    });

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
        if (!Object.keys(chapterForm).includes(params.label))
            return chapterForms;
        return {...chapterForms, [params.id]: updateFormValue(chapterForm, params.label, params.value, true)}
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
        <Panel
            title="Edit Book"
            onClose={props.onClose}
        >
            <div>
                <div className="px-8 py-8 pb-8 border-b border-neutral-900">
                    <p className="mb-2 text-neutral-300 font-medium">
                        Book Details
                    </p>
                    <div className="flex flex-col gap-y-6">
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
                    </div>
                </div>
                <div className="px-8 py-8 pb-8 border-b border-neutral-900">
                    <p className="mb-2 text-neutral-300 font-medium">
                        Chapter Details
                    </p>
                    <div className="flex flex-col gap-y-6">
                        <DragDropProvider
                            onDragEnd={(event) => {
                                const update = move(Object.keys(chapterForms), event);
                                const updatedChapterForms = {...chapterForms};
                                for (let i = 0; i < update.length; i++) {
                                    updatedChapterForms[update[i]].chapter_number.value = String(i);
                                }
                                setChapterForms(updatedChapterForms);
                            }}
                        >
                            {sortedChapterForms.map(([formID, form], i) => (
                                <Fragment key={formID}>
                                    <MutateChapterInList
                                        form={form}
                                        formID={formID}
                                        setForm={setChapterForm}
                                        setChapterForms={setChapterForms}
                                        updateChapterForm={updateChapterForm}
                                        isUpdate
                                        onDelete={() => {
                                            setChapterForms(forms => deleteChapterForm(forms, formID))
                                        }}
                                        isSortable
                                        sortableIndex={i}
                                    />
                                </Fragment>
                            ))}
                        </DragDropProvider>
                        <MutateChapterInList
                            form={chapterForm}
                            formID={""}
                            setForm={setChapterForm}
                            isCreate
                            onCreate={() => {
                                if (!testForm(chapterForm))
                                    return;
                                setChapterForms(forms => insertChapterForm(forms, String(chapterID--), chapterForm));
                                setChapterForm(resetForm(chapterForm));
                            }}
                        />
                    </div>
                </div>
                <div className="px-8 py-4">
                    <Button
                        label="Save"
                        outerClassName="!w-full"
                        onClick={() => {
                            onUpdateBook(form);
                            onUpdateChapters(props.chapters, chapterForms);
                        }}
                    />
                </div>
            </div>
        </Panel>
    )
}