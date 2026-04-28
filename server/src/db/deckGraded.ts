import db from "./db.js";
import type { Deck } from "./deck.js";


export interface DeckGraded {
    deck_graded_id: number;
    duration: number;
    number_correct: number;
    number_incorrect: number;
    deck_id: number;
}


export interface DeckGradedCard {
    choice: number;
    deck_graded_id: number;
    deck_card_id: number;
}


export async function SelectGradedDeck(deckGradedID: number, readerID: string) {
    try {
        const [rowsDeck, rowsDeckCard] = await db.begin(async (db: any) => [
            await db<DeckGraded[]>`
                SELECT  * 
                FROM    deck_graded 
                WHERE   deck_graded_id = ${deckGradedID} AND
                        EXISTS (
                            SELECT  1
                            FROM    Deck
                            WHERE   Deck.deck_id = Deck_Graded.deck_id AND
                                    Deck.reader_id = ${readerID}
                            LIMIT   1
                        )
                LIMIT   1;
            `,
            await db<(DeckGraded & DeckGradedCard)[]>`
                SELECT  * 
                FROM    deck_card_graded 
                JOIN    deck_graded  
                ON      deck_graded.deck_graded_id = deck_card_graded.deck_graded_id
                WHERE   deck_graded.deck_graded_id = ${deckGradedID} AND
                        EXISTS (
                            SELECT  1
                            FROM    Deck
                            WHERE   Deck.deck_id = Deck_Graded.deck_id AND
                                    Deck.reader_id = ${readerID}
                            LIMIT   1
                        )
            `
        ]);

        if (!rowsDeck || rowsDeck.length !== 1)
            return null;

        return {
            deckGraded: rowsDeck[0],
            deckGradedCards: rowsDeckCard
        };
    }
    catch (error) {
        console.error("Error Selecting Graded Deck");
        if (process.env.ENV !== "production")
            console.error(error);
        return null;
    }
}


export async function SelectGradedDecks(readerID: string) {
    try {
        const rows = await db<(Deck & DeckGraded)[]>`
            SELECT  * 
            FROM    Deck_Graded
            JOIN    Deck
            ON      Deck_Graded.deck_id = Deck.deck_id 
            WHERE   Deck.reader_id = ${readerID};
        `;
        return rows;
    }
    catch (error) {
        console.error("Error Selecting Graded Decks");
        if (process.env.ENV !== "production")
            console.error(error);
        return null;
    }
}


export async function SelectGradedDecksByBooks(bookIDs: number[], readerID: string) {
    try {
        const rows = await db<(Deck & DeckGraded)[]>`
            SELECT  Deck.*, 
                    Deck_Graded.*
            FROM    Deck 
            JOIN    Deck_Graded     ON      Deck.deck_id = Deck_Graded.deck_id
            JOIN    Chapter         ON      Chapter.chapter_id = Deck.deck_chapters 
            JOIN    Book            ON      Book.book_id = Chapter.book_id
            WHERE   reader_id = ${readerID} AND
                    Book.book_id = ${bookIDs}
        `;
        return rows;
    }
    catch (error) {
        console.error("Error Selecting Decks");
        if (process.env.ENV !== "production")
            console.error(error);
        return null;
    }
}


export async function SelectGradedDecksByChapters(chapterIDs: number[], readerID: string) {
    try {
        const rows = await db<(Deck & DeckGraded)[]>`
            SELECT  Deck.*,
                    Deck_Graded.* 
            FROM    Deck 
            JOIN    Deck_Graded     ON      Deck.deck_id = Deck_Graded.deck_id
            JOIN    Chapter         ON      Chapter.chapter_id = Deck.deck_chapters 
            WHERE   reader_id = ${readerID} AND
                    Chapter.chapter_id = ${chapterIDs}
        `;
        return rows;
    }
    catch (error) {
        console.error("Error Selecting Decks");
        if (process.env.ENV !== "production")
            console.error(error);
        return null;
    }
}


export async function SelectGradedDecksByDeck(deckID: number, readerID: string) {
    try {
        const rows = await db<(Deck & DeckGraded)[]>`
            SELECT  * 
            FROM    Deck_Graded
            JOIN    Deck
            ON      Deck_Graded.deck_id = Deck.deck_id 
            WHERE   Deck.deck_id = ${deckID} AND 
                    Deck.reader_id = ${readerID};
        `;
        return rows;
    }
    catch (error) {
        console.error("Error Selecting Graded Decks");
        if (process.env.ENV !== "production")
            console.error(error);
        return null;
    }
}


export async function InsertGradedDeck(deck: Omit<DeckGraded, "deck_graded_id">, choices: [number, number][], readerID: string) {
    try {
        return await db.begin(async (db: any) => {
            // Deck
            const rowsDeckGraded = await db`
                INSERT INTO deck_graded (
                    number_correct, 
                    number_incorrect, 
                    duration,
                    deck_id
                )
                SELECT  ${deck.number_correct},
                        ${deck.number_incorrect},
                        ${deck.duration},
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

            if (!rowsDeckGraded || rowsDeckGraded.length !== 1)
                throw 'Insert Failed';


            // Choices -> Cards
            const deckGradedCard = choices.map(choice => ({ 
                deck_graded_id: (<any> rowsDeckGraded)[0].deck_graded_id, 
                deck_card_id: choice[0], 
                choice: choice[1]
            }));


            // Card
            const rowsDeckGradedCard = await db`
                INSERT INTO deck_card_graded ${db(deckGradedCard)}
                RETURNING *
            `;

            if (!rowsDeckGradedCard || rowsDeckGradedCard.length !== choices.length)
                throw 'Insert Failed';

            return {
                deckGraded: rowsDeckGraded[0],
                deckGradedCards: rowsDeckGradedCard
            };
        });
    }
    catch (error) {
        console.error("Error Inserting Graded Deck");
        if (process.env.ENV !== "production")
            console.error(error);
        return null;
    }
}


export async function DeleteGradedDeck(deckGradedID: number, readerID: string) {
    try {
        return await db.begin(async (db: any) => {
            const rows = await db`
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

            if (!rows || rows.length !== 1)
                throw 'Delete Failed';

            return rows[0];
        });
    }
    catch (error) {
        console.error("Error Deleting Graded Deck");
        if (process.env.ENV !== "production")
            console.error(error);
        return null;
    }
}