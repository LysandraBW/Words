import type { NullableBy } from "../utilities/types.js";
import db from "./db.js";


export interface Chapter {
    chapter_id: number;
    chapter_title: string;
    chapter_number: number;
    book_id: number;
}


export async function SelectChapter(chapterID: number, readerID: string) {
    try {
        const rows = await db<Chapter[]>`
            SELECT  * 
            FROM    Chapter 
            JOIN    Book 
            ON      Chapter.book_id = Book.book_id
            WHERE   chapter_id = ${chapterID} AND
                    reader_id = ${readerID}
            LIMIT   1;
        `;
        return rows;
    }
    catch (error) {
        console.error("Error Selecting Chapter");
        if (process.env.ENV !== "production")
            console.error(error);
        return null;
    }
}


export async function SelectChapters(readerID: string) {
    try {
        const rows = await db<Chapter[]>`
            SELECT  * 
            FROM    Book
            JOIN    Chapter 
            ON      Chapter.book_id = Book.book_id
            WHERE   Book.reader_id = ${readerID}
        `;
        return rows;
    }
    catch (error) {
        console.error("Error Selecting Chapters");
        if (process.env.ENV !== "production")
            console.error(error);
        return null;
    }
}


export async function SelectChaptersFromBook(bookID: number, readerID: string) {
    try {
        const rows = await db<Chapter[]>`
            SELECT  * 
            FROM    Book 
            JOIN    Chapter
            ON      Chapter.book_id = Book.book_id
            WHERE   Book.book_id = ${bookID} AND
                    Book.reader_id = ${readerID}
        `;
        return rows;
    }
    catch (error) {
        console.error("Error Selecting Chapters");
        if (process.env.ENV !== "production")
            console.error(error);
        return null;
    }
}


export async function InsertChapter(chapter: Omit<Chapter, "chapter_id">, readerID: string) {
    try {
        const rows = await db<Chapter[]>`
            INSERT INTO Chapter (
                chapter_title, 
                chapter_number, 
                Chapterbook_id
            )
            SELECT  ${chapter.chapter_title},
                    ${chapter.chapter_number},
                    ${chapter.book_id}
            WHERE EXISTS (
                SELECT  1 
                FROM    Book
                WHERE   Book.reader_id = ${readerID} AND
                WHERE   Book.chapter_id = ${chapter.book_id}
                LIMIT   1
            )
            RETURNING *
        `;
        return rows;
    }
    catch (error) {
        console.error("Error Inserting Chapter");
        if (process.env.ENV !== "production")
            console.error(error);
        return null;
    }
}


export async function UpdateChapter(chapter: NullableBy<Chapter, "chapter_title" | "chapter_number">, readerID: string) {
    try {
        const rows = await db<Chapter[]>`
            UPDATE  Chapter
            SET     chapter_title = COALESCE(${chapter.chapter_title ?? null}, chapter_title),
                    chapter_number = COALESCE(${chapter.chapter_number ?? null}, chapter_number)
            WHERE   chapter_id = ${chapter.chapter_id} AND
                    ${readerID} IN (
                        SELECT  reader_id 
                        FROM    Chapter 
                        JOIN    Book 
                        ON      Chapter.book_id = Book.book_id 
                        WHERE   Chapter.chapter_id = ${chapter.chapter_id}
                        LIMIT   1
                    )
            RETURNING *
        `;
        return rows;
    }
    catch (error) {
        console.error("Error Updating Chapter");
        if (process.env.ENV !== "production")
            console.error(error);
        return null;
    }
}


export async function DeleteChapter(chapterID: number, readerID: string) {
    try {
        const result = await db`
            DELETE FROM Chapter
            WHERE   chapter_id = ${chapterID} AND
                    ${readerID} IN (
                        SELECT  reader_id 
                        FROM    Chapter 
                        JOIN    Book 
                        ON      Chapter.book_id = Book.book_id 
                        WHERE   Chapter.chapter_id = ${chapterID}
                        LIMIT   1
                    )
        `;
        return result;
    }
    catch (error) {
        console.error("Error Deleting Chapter");
        if (process.env.ENV !== "production")
            console.error(error);
        return null;
    }
}