import { BookType } from "./book";
import { WordType } from "./word";

export interface ChapterType {
    chapter_id: number;
    chapter_title: string;
    chapter_number: string;
    book_id: number;
}

export async function insertChapter(chapter: ChapterType) {
    const response = await fetch('http://127.0.0.1:8000/chapters', {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(chapter)
    });

    if (response.status !== 200)
        return null;

    const data: ChapterType | null = await response.json();
    return data;
}

export async function updateChapter(chapter: ChapterType) {
    const response = await fetch(`http://127.0.0.1:8000/chapters/${chapter.chapter_id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(chapter)
    });

    if (response.status !== 200)
        return null;

    const data: ChapterType | null = await response.json();
    return data;
}

export async function deleteChapter(chapterID: number) {
    const response = await fetch(`http://127.0.0.1:8000/chapters/${chapterID}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        }
    });

    if (response.status !== 200)
        return null;

    const data: ChapterType | null = await response.json();
    return data;
}

export async function selectChapter(chapterID: number) {
    const response = await fetch(`http://127.0.0.1:8000/chapters/${chapterID}`, {
        method: "GET",
        credentials: "include"
    });

    if (response.status !== 200)
        return null;

    const data: (ChapterType & BookType) | null = await response.json();
    return data;
}

export async function selectChapterWords(chapterID: number) {
    const response = await fetch(`http://127.0.0.1:8000/chapters/${chapterID}/words`, {
        method: "GET",
        credentials: "include"
    });

    if (response.status !== 200)
        return null;

    const data: WordType[] | null = await response.json();
    return data;
}