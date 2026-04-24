import db from "./db.js";
import type { PartialBy } from "../utilities/types.js";

export interface Word {
    word_id: number;
    word: string[];
    word_number_instances: number;
    chapter_id: number;
}


export async function SelectWord(wordID: number, readerID: string) {
    try {
        const rows = await db<Word[]>`
            SELECT  * 
            FROM    word 
            JOIN    Chapter ON word.chapter_id = Chapter.chapter_id
            JOIN    Book    ON Book.book_id = Chapter.book_id 
            WHERE   word.word_id = ${wordID} AND
                    Book.reader_id = ${readerID}
            LIMIT   1;
        `;
        return rows;
    }
    catch (error) {
        console.error("Error Selecting Word");
        if (process.env.ENV !== "production")
            console.error(error);
        return null;
    }
}


export async function SelectWordsFromBook(bookID: number, readerID: string) {
    try {
        const rows = await db<Word[]>`
            SELECT  * 
            FROM    word
            JOIN    Chapter ON word.chapter_id = Chapter.chapter_id
            JOIN    Book    ON Book.book_id = Chapter.book_id 
            WHERE   Book.reader_id = ${readerID} AND
                    Book.book_id = ${bookID}
        `;
        return rows;
    }
    catch (error) {
        console.error("Error Selecting Words");
        if (process.env.ENV !== "production")
            console.error(error);
        return null;
    }
}


export async function SelectWordsFromChapter(chapterID: number, readerID: string) {
    try {
        const rows = await db<Word[]>`
            SELECT  * 
            FROM    word
            JOIN    Chapter ON word.chapter_id = Chapter.chapter_id
            JOIN    Book    ON Book.book_id = Chapter.book_id 
            WHERE   Book.reader_id = ${readerID} AND
                    Chapter.chapter_id = ${chapterID}
        `;
        return rows;
    }
    catch (error) {
        console.error("Error Selecting Words");
        if (process.env.ENV !== "production")
            console.error(error);
        return null;
    }
}


export async function InsertWord(word: Omit<Word, "word_id" | "word_number_instances">, readerID: string) {
    try {
        const rows = await db<Word[]>`
            INSERT INTO word (
                word,
                chapter_id
            )
            SELECT ${word.word}, ${word.chapter_id}
            WHERE EXISTS (
                SELECT  1 
                FROM    Chapter
                JOIN    Book ON Chapter.book_id = Book.book_id
                WHERE   Book.reader_id = ${readerID} AND
                WHERE   Chapter.chapter_id = ${word.chapter_id}
                LIMIT   1
            )
            RETURNING word_id
        `;
        return rows;
    }
    catch (error) {
        console.error("Error Inserting Word");
        if (process.env.ENV !== "production")
            console.error(error);
        return null;
    }
}


export async function UpdateWord(word: PartialBy<Word, "word" | "word_number_instances">, readerID: string) {
    try {
        const rows = await db<Word[]>`
            UPDATE  word
            SET     word = COALESCE(${word.word ?? null}, word),
                    word_number_instances = COALESCE(${word.word_number_instances ?? null}, word_number_instances)
            WHERE   word_id = ${word.word_id} AND
                    ${readerID} IN (
                        SELECT  reader_id 
                        FROM    word 
                        JOIN    Chapter ON Chapter.chapter_id = word.word_id
                        JOIN    Book ON Book.book_id = Chapter.book_id
                        WHERE   word.word_id = ${word.word_id}
                        LIMIT   1
                    )
        `;
        return rows;
    }
    catch (error) {
        console.error("Error Updating Word");
        if (process.env.ENV !== "production")
            console.error(error);
        return null;
    }
}


export async function DeleteWord(wordID: number, readerID: string) {
    try {
        const rows = await db`
            DELETE FROM word
            WHERE   word_id = ${wordID} AND
                    ${readerID} IN (
                        SELECT  reader_id 
                        FROM    word 
                        JOIN    Chapter ON Chapter.chapter_id = word.word_id
                        JOIN    Book ON Book.book_id = Chapter.book_id
                        WHERE   word.word_id = ${wordID}
                        LIMIT   1
                    )
        `;
        return rows;
    }
    catch (error) {
        console.error("Error Deleting Word");
        if (process.env.ENV !== "production")
            console.error(error);
        return null;
    }
}


export async function Incrementword_number_instances(wordID: number, readerID: string) {
    try {
        const rows = await db`
            UPDATE  word
            SET     word_number_instances = word_number_instances + 1,
            WHERE   word_id = ${wordID} AND
                    ${readerID} IN (
                        SELECT  reader_id 
                        FROM    word 
                        JOIN    Chapter ON Chapter.chapter_id = word.word_id
                        JOIN    Book ON Book.book_id = Chapter.book_id
                        WHERE   word.word_id = ${wordID}
                        LIMIT   1
                    )
            RETURNING *;
        `;
        return rows;
    }
    catch (error) {
        console.error("Error Incrementing Word Number Instances");
        if (process.env.ENV !== "production")
            console.error(error);
        return null;
    }
}


export async function Decrementword_number_instances(wordID: number, readerID: string) {
    try {
        const rows = await db`
            UPDATE  word
            SET     word_number_instances = word_number_instances - 1,
            WHERE   word_id = ${wordID} AND
                    ${readerID} IN (
                        SELECT  reader_id 
                        FROM    word 
                        JOIN    Chapter ON Chapter.chapter_id = word.word_id
                        JOIN    Book ON Book.book_id = Chapter.book_id
                        WHERE   word.word_id = ${wordID}
                        LIMIT   1
                    )
        `;
        return rows;
    }
    catch (error) {
        console.error("Error Decrementing Word Number Instances");
        if (process.env.ENV !== "production")
            console.error(error);
        return null;
    }
}