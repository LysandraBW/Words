import { Form, updateFormValue } from "@/utilities/form";
import InputDropdown from "../input/InputDropdown";
import { BookType } from "@/services/server/book";
import { ChapterType } from "@/services/server/chapter";

interface SelectBookAndChapterProps {
    books: BookType[];
    chapters: ChapterType[];
    form: Form<any>;
    setForm: (form: Form<any>) => any;
}

export default function SelectBookAndChapter(props: SelectBookAndChapterProps) {
    return (
        <div>
            <p className="mb-2 text-neutral-300 font-medium">
                Select Book and Chapter
            </p>
            <div className="flex flex-col gap-y-6">
                <InputDropdown
                    label="Book"
                    toggleLabel={props.books?.find(book => book.book_id === Number(props.form.book_id.value))?.book_name}
                    value={[props.form.book_id.value]}
                    options={props.books?.map(book => ({
                        value: book.book_id + "",
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
                    onChange={(value) => props.setForm(updateFormValue(props.form, "book_id", value))}
                    error={props.form.book_id.error}
                />
                <InputDropdown
                    label="Book Chapter"
                    toggleLabel={props.chapters?.find(chapter => chapter.chapter_id === Number(props.form.chapter_id.value))?.chapter_title}
                    value={[props.form.chapter_id.value]}
                    options={props.chapters?.filter(chapter => `${chapter.book_id}` === props.form.book_id.value).map(chapter => ({
                        value: chapter.chapter_id + "",
                        textLabel: chapter.chapter_title,
                        optionLabel: (
                            <div className="overflow-clip text-inherit">
                                <span className="block truncate text-inherit group-hover:text-blue-400 text-sm">
                                    <span className="font-medium">
                                        Chapter {chapter.chapter_number}:{' '}
                                    </span>
                                    {chapter.chapter_title}
                                </span>
                            </div>
                        )
                    }))}
                    onChange={(value) => props.setForm(updateFormValue(props.form, "book_id", value))}
                    error={props.form.chapter_id.error}
                />
            </div>
        </div>
    )
}