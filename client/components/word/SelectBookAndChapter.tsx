import { Form, updateFormValue } from "@/utilities/form";
import InputDropdown from "../input/InputDropdown";
import { BookType } from "@/services/server/book";
import { ChapterType } from "@/services/server/chapter";
import { useEffect } from "react";

interface SelectBookAndChapterProps {
    books: BookType[];
    chapters: ChapterType[];
    form: Form<any>;
    setForm: (form: Form<any>) => any;
}

export default function SelectBookAndChapter(props: SelectBookAndChapterProps) {
    useEffect(() => {
        if (!props.form.book_id.value[0])
            return;

        const bookChapters = props.chapters.filter(chapter => chapter.book_id === props.form.book_id.value[0]).map(chapter => chapter.chapter_id);
        if (!bookChapters.includes(props.form.chapter_id.value[0])) {
            props.setForm(updateFormValue(props.form, "chapter_id", [], false));
        }
    }, [props.form.book_id.value[0]]);

    
    return (
        <div>
            <p className="mb-2 text-neutral-300 font-medium">
                Select Book and Chapter
            </p>
            <div className="flex flex-col gap-y-6">
                <InputDropdown
                    label="Book"
                    toggleLabel={props.books?.find(book => book.book_id === Number(props.form.book_id.value))?.book_name}
                    value={props.form.book_id.value}
                    options={props.books?.map(book => ({
                        value: book.book_id + "",
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
                    onChange={(value) => props.setForm(updateFormValue(props.form, "book_id", [value]))}
                    error={props.form.book_id.error}
                />
                <InputDropdown
                    label="Book Chapter"
                    toggleLabel={props.chapters?.find(chapter => chapter.chapter_id === Number(props.form.chapter_id.value))?.chapter_title}
                    value={props.form.chapter_id.value}
                    options={props.chapters?.filter(chapter => Number(chapter.book_id) === Number(props.form.book_id.value[0])).map(chapter => ({
                        value: chapter.chapter_id + "",
                        textLabel: chapter.chapter_title,
                        optionLabel: (
                            <div className="overflow-clip text-inherit">
                                <span className="block truncate text-inherit text-sm">
                                    {chapter.chapter_title}
                                </span>
                            </div>
                        )
                    }))}
                    onChange={(value) => props.setForm(updateFormValue(props.form, "chapter_id", [value]))}
                    error={props.form.chapter_id.error}
                    elementNoResultsFound={
                        <div className="px-4">
                            <p className="text-sm text-neutral-200 font-medium">
                                {props.form.book_id.value.length === 0 ? "No Book Selected" : "No Chapters Found"}
                            </p>
                            <p className="text-sm text-neutral-400">
                                {props.form.book_id.value.length === 0 ? "Must select a book." : "No chapters were found for this book."}
                            </p>    
                        </div>
                    }
                />
            </div>
        </div>
    )
}