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
}


export async function SelectBook(bookID: number, readerID: string) {
    try {
        const rows = await db<Book[]>`
            SELECT  * 
            FROM    Book 
            WHERE   book_id = ${bookID} AND
                    reader_id = ${readerID}
            LIMIT   1;
        `;
        return rows;
    }
    catch (error) {
        console.error("Error Selecting Book");
        if (process.env.ENV !== "production")
            console.error(error);
        return null;
    }
}


export async function SelectBooks(readerID: string) {
    try {
        const rows = await db<Book[]>`
            SELECT  * 
            FROM    Book 
            WHERE   reader_id = ${readerID};
        `;
        return rows;
    }
    catch (error) {
        console.error("Error Selecting Books");
        if (process.env.ENV !== "production")
            console.error(error);
        return null;
    }
}


export async function InsertBook(book: Omit<NullableBy<Book, "book_author" | "book_year" | "book_cover_image" | "book_background_image">, "book_id">) {
    try {
        const rows = await db<Book[]>`
            INSERT INTO Book (
                book_name, 
                book_cover_image, 
                book_background_image,
                book_year,
                book_author,
                reader_id
            )
            VALUES (
                ${book.book_name},
                ${book.book_cover_image || null},
                ${book.book_background_image || null},
                ${book.book_year || null},
                ${book.book_author || null},
                ${book.reader_id}
            ) 
            RETURNING *
        `;
        return rows;
    }
    catch (error) {
        console.error("Error Inserting Book");
        if (process.env.ENV !== "production")
            console.error(error);
        return null;
    }
}


export async function UpdateBook(book: NullableBy<Book, "book_name" | "book_cover_image" | "book_background_image" | "book_year" | "book_author">) {
    try {
        const rows = await db<Book[]>`
            UPDATE  Book
            SET     book_name = COALESCE(${book.book_name ?? null}, book_name),
                    book_cover_image = COALESCE(${book.book_cover_image ?? null}, book_cover_image),
                    book_background_image = COALESCE(${book.book_background_image ?? null}, book_background_image),
                    book_year = COALESCE(${book.book_year ?? null}, book_year),
                    book_author = COALESCE(${book.book_author ?? null}, book_author)
            WHERE   reader_id = ${book.reader_id}
            RETURNING *
        `;
        return rows;
    }
    catch (error) {
        console.error("Error Updating Book");
        if (process.env.ENV !== "production")
            console.error(error);
        return null;
    }
}


export async function DeleteBook(bookID: number, readerID: string) {
    try {
        const rows = await db`
            DELETE FROM Book
            WHERE   book_id = ${bookID} AND
                    reader_id = ${readerID}
        `;
        return rows;
    }
    catch (error) {
        console.error("Error Deleting Book");
        if (process.env.ENV !== "production")
            console.error(error);
        return null;
    }
}