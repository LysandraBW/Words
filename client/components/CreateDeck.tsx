import { Fragment, useState } from "react";
import InputText from "./input/InputText";
import InputLabelError from "./input/InputLabelError";

type StructuredChapters = Array<{
    name: string; 
    chapters: Array<{
        chapter_id: number;
        chapterName: string;
    }>;
}>

interface CreateDeckProps {
    books: StructuredChapters;
    onClose: () => void;
    onCreate: () => void;
}

export default function CreateDeck(props: CreateDeckProps) {
    const [name, setName] = useState("");
    const [nameErrorMessage, setNameErrorMessage] = useState("");

    const [chapters, setChapters] = useState<Set<number>>(new Set());
    const [chaptersErrorMessage, setChaptersErrorMessage] = useState("");

    const changeChapterSelection = (chapters: Set<number>, chapter: number) => {
        const updatedChapters = new Set(chapters);
        updatedChapters.has(chapter) ? updatedChapters.delete(chapter) : updatedChapters.add(chapter);
        return updatedChapters;
    }

    const createDeck = (name: string, chapters: Set<number>) => {
        const isValidName = checkName(name);
        const isValidChapters = checkChapters(chapters);

        if (!isValidName || !isValidChapters)
            return;

        props.onClose();
    }

    const checkName = (name: string) => {
        const isValidName = !!name.length;
        setNameErrorMessage(isValidName ? "" : "Must enter a name.");
        return isValidName;
    }

    const checkChapters = (chapters: Set<number>) => {
        const isValidChapters = !!chapters.size;
        setChaptersErrorMessage(isValidChapters ? "" : "Must select at least one chapter.");
        return isValidChapters;
    }

    const onChangeName = (name: string): void => {
        setName(name);
        checkName(name);        
    }

    const onChangeChapterSelection = (chapters: Set<number>, chapter: number): void => {
        const updatedChapters = changeChapterSelection(chapters, chapter);
        setChapters(updatedChapters);
        checkChapters(updatedChapters);
    }

    return (
        <div>
            <div
                onClick={props.onClose}
            >
                Close
            </div>
            <InputText
                value={name}
                label="Name"
                error={nameErrorMessage}
                onChange={onChangeName}
            />
            {props.books.map((book, i) => (
                <div key={i}>
                    <h6>
                        <b>
                            {book.name}
                        </b>
                    </h6>
                    {book.chapters.map((chapter, j) => (
                        <div key={j}>
                            <input
                                type="checkbox"
                                checked={chapters.has(chapter.chapter_id)}
                                onChange={() => onChangeChapterSelection(chapters, chapter.chapter_id)}
                            />
                            {chapter.chapterName}
                        </div>
                    ))}
                </div>
            ))}
            {chaptersErrorMessage &&
                <InputLabelError
                    label={chaptersErrorMessage}
                />
            }
            <div>
                <button
                    onClick={props.onClose}
                >
                    Cancel
                </button>
                <button
                    onClick={() => createDeck(name, chapters)}
                >
                    Create
                </button>
            </div>
        </div>
    )
}