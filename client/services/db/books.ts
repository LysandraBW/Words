import { ChapterType } from "./chapter";

export interface BookType {
    book_id: number;
    book_name: string;
    book_cover_image: string | null;
    book_background_image: string | null;
    book_year: string;
    book_author: string[];
    reader_id: string;
}

export async function getBook(bookID: string) {
    const response = await fetch(`http://127.0.0.1:8000/books/${bookID}`, {
        credentials: "include"
    });

    if (response.status !== 200)
        return null;

    const data: BookType[] = await response.json();
    return data;
}

export async function getBooks() {
    const response = await fetch('http://127.0.0.1:8000/books', {
        credentials: "include"
    });

    if (response.status !== 200)
        return null;

    const data: BookType[] = await response.json();
    return data;
}

export async function getBookChapters(bookID: string) {
    const response = await fetch(`http://127.0.0.1:8000/books/${bookID}/chapters`, {
        credentials: "include"
    });

    if (response.status !== 200)
        return null;

    const data: ChapterType[] = await response.json();
    return data;
}

export async function createBook(book: BookType) {
    const response = await fetch('http://127.0.0.1:8000/books', {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(book)
    });

    if (response.status !== 200)
        return null;

    const data: BookType[] = await response.json();
    return data;
}

export async function updateBook(book: BookType) {
    const response = await fetch(`http://127.0.0.1:8000/books/${book.book_id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(book)
    });

    if (response.status !== 200)
        return null;

    const data: BookType[] = await response.json();
    return data;
}