import db from "./db.js";
import type { NullableBy } from "../utilities/types.js";

export interface Book {
    book_id: number;
    book_name: string;
    book_cover_image: string;
    book_background_image: string;
    book_year: number;
    book_author: string[];
    reader_id: string;
    background_color: string;
    foreground_color: string;
}


export async function SelectBook(bookID: number, readerID: string) {
    return await db<Book[]>`
        SELECT  * 
        FROM    Book 
        WHERE   book_id = ${bookID} AND
                reader_id = ${readerID}
        LIMIT   1;
    `;
}


export async function SelectBooks(readerID: string) {
    return await db<Book[]>`
        SELECT  * 
        FROM    Book 
        WHERE   reader_id = ${readerID};
    `;
}


export async function InsertBook(book: Omit<NullableBy<Book, "book_author" | "book_year" | "book_cover_image" | "book_background_image" | "background_color" | "foreground_color">, "book_id">) {
    return await db<Book[]>`
        INSERT INTO Book (
            book_name, 
            book_cover_image, 
            book_background_image,
            book_year,
            book_author,
            reader_id,
            background_color,
            foreground_color,
        )
        VALUES (
            ${book.book_name},
            ${book.book_cover_image || null},
            ${book.book_background_image || null},
            ${book.book_cover_image || null},
            ${book.book_background_image || null},
            ${book.book_year || null},
            ${book.book_author || null},
            ${book.reader_id},
            ${book.background_color || null},
            ${book.foreground_color || null}
        ) 
        RETURNING *
    `;
}


export async function UpdateBook(book: NullableBy<Book, "book_name" | "book_cover_image" | "book_background_image" | "book_year" | "book_author" | "background_color" | "foreground_color">) {
    return await db<Book[]>`
            UPDATE  Book
            SET     book_name = COALESCE(${book.book_name ?? null}, book_name),
                    book_year = COALESCE(${book.book_year ?? null}, book_year),
                    book_author = COALESCE(${book.book_author ?? null}, book_author),
                    book_cover_image = COALESCE(${book.book_cover_image ?? null}, book_cover_image),
                    book_background_image = COALESCE(${book.book_background_image ?? null}, book_background_image),
                    background_color = COALESCE(${book.background_color ?? null}, background_color),
                    foreground_color = COALESCE(${book.foreground_color ?? null}, foreground_color),
            WHERE   reader_id = ${book.reader_id} AND
                    book_id = ${book.book_id}
            RETURNING *
    `;
}


export async function DeleteBook(bookID: number, readerID: string) {
    return await db<Book[]>`
        DELETE FROM Book
        WHERE   book_id = ${bookID} AND
                reader_id = ${readerID}
        RETURNING *
    `;
}