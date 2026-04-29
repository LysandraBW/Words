import { ChapterType } from "./chapter";
import { WordType } from "./word";

export interface BookType {
    book_id: number;
    book_name: string;
    book_cover_image: string | null;
    book_background_image: string | null;
    book_year: string;
    book_author: string[];
    reader_id: string;
}

export type CreateBookType = Pick<
    BookType, 
    "book_name" | "book_author" | "book_cover_image" | "book_background_image" | "book_year"
>;

export async function selectBook(bookID: number) {
    const response = await fetch(`http://127.0.0.1:8000/books/${bookID}`, {
        credentials: "include"
    });

    if (response.status !== 200)
        return null;

    const data: BookType | null = await response.json();
    return data;
}

export async function selectBooks() {
    const response = await fetch('http://127.0.0.1:8000/books', {
        credentials: "include"
    });

    if (response.status !== 200)
        return null;

    const data: BookType[] | null = await response.json();
    return data;
}

export async function selectBookChapters(bookID: number) {
    const response = await fetch(`http://127.0.0.1:8000/books/${bookID}/chapters`, {
        credentials: "include"
    });

    if (response.status !== 200)
        return null;

    const data: ChapterType[] | null = await response.json();
    return data;
}

export async function selectBookWords(bookID: number) {
    const response = await fetch(`http://127.0.0.1:8000/books/${bookID}/words`, {
        credentials: "include"
    });

    if (response.status !== 200)
        return null;

    const data: WordType[] | null = await response.json();
    return data;
}

export async function insertBook(book: CreateBookType) {
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

    const data: BookType | null = await response.json();
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

    const data: BookType | null = await response.json();
    return data;
}

export async function deleteBook(bookID: number) {
    const response = await fetch(`http://127.0.0.1:8000/books/${bookID}`, {
        method: "DELETE",
        credentials: "include",
    });

    if (response.status !== 200)
        return null;

    const data: BookType | null = await response.json();
    return data;
}