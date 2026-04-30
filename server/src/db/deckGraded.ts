import db from "./db.js";
import type { Deck, DeckQuestion } from "./deck.js";


export type DeckGradedQuestion = DeckQuestion & { choice: number; };


export interface DeckGraded {
    deck_graded_id: number;
    duration: number;
    number_correct: number;
    number_incorrect: number;
    deck_questions: DeckGradedQuestion[];
    deck_id: number;
}


export async function SelectGradedDeck(deckGradedID: number, readerID: string) {
    return await db<DeckGraded[]>`
        SELECT  * 
        FROM    Deck_Graded 
        WHERE   deck_graded_id = ${deckGradedID} AND
                EXISTS (
                    SELECT  1
                    FROM    Deck
                    WHERE   Deck.deck_id = Deck_Graded.deck_id AND
                            Deck.reader_id = ${readerID}
                    LIMIT   1
                )
        LIMIT   1;
    `;
}


export async function SelectGradedDecks(readerID: string) {
    return await db<(Deck & DeckGraded)[]>`
        SELECT  * 
        FROM    Deck_Graded
        JOIN    Deck
        ON      Deck_Graded.deck_id = Deck.deck_id 
        WHERE   Deck.reader_id = ${readerID};
    `;
}


export async function SelectGradedDecksByBooks(bookIDs: number[], readerID: string) {
    return await db<(Deck & DeckGraded)[]>`
        SELECT  Deck.*, 
                Deck_Graded.*
        FROM    Deck 
        JOIN    Deck_Graded     ON      Deck.deck_id = Deck_Graded.deck_id
        JOIN    Chapter         ON      Chapter.chapter_id = ANY(Deck.deck_chapters) 
        JOIN    Book            ON      Book.book_id = Chapter.book_id
        WHERE   Book.reader_id = ${readerID} AND
                Book.book_id IN ${db(bookIDs)}
    `;
}


export async function SelectGradedDecksByChapters(chapterIDs: number[], readerID: string) {
    return await db<(Deck & DeckGraded)[]>`
        SELECT  Deck.*,
                Deck_Graded.* 
        FROM    Deck 
        JOIN    Deck_Graded     ON      Deck.deck_id = Deck_Graded.deck_id
        JOIN    Chapter         ON      Chapter.chapter_id = ANY(Deck.deck_chapters) 
        WHERE   Deck.reader_id = ${readerID} AND
                Chapter.chapter_id  IN ${db(chapterIDs)}
    `;
}


export async function SelectGradedDecksByDeck(deckID: number, readerID: string) {
    return await db<(Deck & DeckGraded)[]>`
        SELECT  * 
        FROM    Deck_Graded
        JOIN    Deck
        ON      Deck_Graded.deck_id = Deck.deck_id 
        WHERE   Deck.deck_id = ${deckID} AND 
                Deck.reader_id = ${readerID};
    `;
}


export async function InsertGradedDeck(deck: Omit<DeckGraded, "deck_graded_id">, readerID: string) {
    return await db<DeckGraded[]>`
        INSERT INTO deck_graded (
            duration,
            number_correct, 
            number_incorrect, 
            deck_questions,
            deck_id
        )
        SELECT  ${deck.number_correct},
                ${deck.number_incorrect},
                ${deck.duration},
                ${db.array(deck.deck_questions.map(q => db.json(q)))},
                ${deck.deck_id}
        WHERE EXISTS (
            SELECT  1
            FROM    Deck
            WHERE   Deck.deck_id = ${deck.deck_id} AND
                    Deck.reader_id = ${readerID}
            LIMIT   1
        )
        RETURNING *
    `;
}


export async function DeleteGradedDeck(deckGradedID: number, readerID: string) {
    return await db<DeckGraded[]>`
        DELETE FROM Deck_Graded
        WHERE   deck_graded_id = ${deckGradedID} AND
                EXISTS (
                    SELECT  1
                    FROM    Deck
                    WHERE   Deck.deck_id = Deck_Graded.deck_id AND
                            Deck.reader_id = ${readerID}
                    LIMIT   1
                )
        RETURNING *
    `;
}