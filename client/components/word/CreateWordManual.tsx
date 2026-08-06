import { Form, updateFormValue } from "@/utilities/form";
import Button from "../Button";
import InputText from "../input/InputText";
import InputTextArea from "../input/InputTextArea";
import { BookType } from "@/services/server/book";
import { ChapterType } from "@/services/server/chapter";
import SelectBookAndChapter from "./SelectBookAndChapter";


interface CreateWordManualProps {
    form: Form<any>;
    setForm: (form: Form<any>) => void;
    books: BookType[];
    chapters: ChapterType[];
}


export default function CreateWordManual(props: CreateWordManualProps) {
    return (
        <>
            <SelectBookAndChapter
                books={props.books}
                chapters={props.chapters}
                form={props.form}
                setForm={props.setForm}
            />
            <div>
                <p className="mb-2 text-neutral-300 font-medium">
                    Select Word
                </p>
                <div className="flex flex-col gap-y-6">
                    <InputText
                        label="Word"
                        value={props.form.word.value}
                        onChange={(value) => props.setForm(updateFormValue(props.form, "word", value))}
                        required={true}
                        error={props.form.word.error}
                    />
                    <InputTextArea
                        label="Word's Meaning"
                        value={props.form.meaning.value}
                        onChange={(value) => props.setForm(updateFormValue(props.form, "meaning", value))}
                        required={true}
                        error={props.form.meaning.error}
                    />
                </div>
            </div>
            <Button
                label="Log Word"
                outerClassName="!w-full"
            />
        </>
    )
}