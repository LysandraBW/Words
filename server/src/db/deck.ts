import 'dotenv/config';
import type { NullableBy } from "../utilities/types.js";
import db from './db.js';
import { getRandomWords } from '../utilities/words.js';


export interface Deck {
    deck_id: number;
    deck_name: string;
    deck_chapters: number[];
    reader_id: string;
}


export interface DeckCard {
    deck_card_id: number;
    deck_id: number;
    words: [string, string][];
}


export interface DeckGraded {
    deck_graded_id: number;
    duration: number;
    number_correct: number;
    number_incorrect: number;
    deck_id: number;
}


export interface DeckCardGraded {
    choice: number;
    deck_graded_id: number;
    deck_card_id: number;
}


export async function SelectWordsFromChapters(chapterIDs: number[], readerID: string) {
    try {
        const rows = await db`
            SELECT  Word
            FROM    Word
            JOIN    Chapter ON Word.chapter_id = Chapter.chapter_id
            JOIN    Book    ON Book.book_id = Chapter.book_id 
            WHERE   Book.reader_id = ${readerID} AND
                    Chapter.chapter_id = ANY(${db.array(chapterIDs)}::int[])
        `;

        if (rows)
            return rows.map(row => row.word)
        return null;
    }
    catch (error) {
        console.error("Error Selecting words");
        if (process.env.ENV !== "production")
            console.error(error);
        return null;
    }
}


export async function SelectDeck(deckID: number, readerID: string) {
    try {
        const [rowsDeck, rowsDeckCard] = await db.begin(async (db: any) => [
            await db<Deck[]>`
                SELECT  * 
                FROM    Deck 
                WHERE   deck_id = ${deckID} AND
                        reader_id = ${readerID}
                LIMIT   1;
            `,
            await db<DeckCard[]>`
                SELECT  * 
                FROM    deck_card 
                JOIN    Deck        ON Deck.deck_id = deck_card.deck_id
                WHERE   Deck.deck_id = ${deckID} AND
                        Deck.reader_id = ${readerID};
            `
        ]);

        return [
            rowsDeck,
            rowsDeckCard
        ];
    }
    catch (error) {
        console.error("Error Selecting Deck");
        if (process.env.ENV !== "production")
            console.error(error);
        return null;
    }
}


export async function SelectDecks(readerID: string) {
    try {
        const rows = await db<Deck[]>`
            SELECT  * 
            FROM    Deck 
            WHERE   reader_id = ${readerID};
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


export async function SelectGradedDeck(deckGradedID: number, readerID: string) {
    try {
        const [rowsDeck, rowsDeckCard] = await db.begin(async (db: any) => [
            await db<DeckGraded[]>`
                SELECT  * 
                FROM    deck_graded 
                WHERE   deck_graded_id = ${deckGradedID} AND
                        reader_id = ${readerID}
                LIMIT   1;
            `,
            await db<DeckCardGraded[]>`
                SELECT  * 
                FROM    deck_card_graded 
                JOIN    deck_graded  
                ON      deck_graded.deck_graded_id = deck_card_graded.deck_graded_id
                WHERE   deck_graded.deck_graded_id = ${deckGradedID} AND
                        deck_graded.reader_id = ${readerID};
            `
        ]);

        return {
            rowsDeck,
            rowsDeckCard
        };
    }
    catch (error) {
        console.error("Error Selecting Graded Deck");
        if (process.env.ENV !== "production")
            console.error(error);
        return null;
    }
}


export async function SelectGradedDecks(reader_id: string) {
    try {
        const rows = await db<DeckGraded[]>`
            SELECT  * 
            FROM    deck_graded
            JOIN    Deck
            ON      deck_graded.deck_id = Deck.deck_id 
            WHERE   Deck.reader_id = ${reader_id};
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


export async function InsertDeck(deck: Omit<Deck, "deck_id">) {
    try {
        const output = await db.begin(async (db: any) => {
            const rowsDeck = await db<Deck[]>`
                INSERT INTO Deck (
                    deck_name, 
                    deck_chapters, 
                    reader_id
                )
                VALUES (
                    ${deck.deck_name},
                    ${deck.deck_chapters},
                    ${deck.reader_id}
                ) 
                RETURNING *
            `;

            if (!rowsDeck || !rowsDeck.length)
                return null;

            const words = await SelectWordsFromChapters(deck.deck_chapters, deck.reader_id);
            
            if (!words)
                return null;

            const cards = await Promise.all(words.map(async (word) => ({
                deck_id: (rowsDeck[0] as any).deck_id,
                words: [
                    word, 
                    ...await getRandomWords(word[0], word[1])
                ]
            })));

            if (!cards || !cards.length)
                return null;

            const rowsDeckCard = await db`
                INSERT INTO deck_card ${db(cards)}
                RETURNING *
            `;

            return [
                rowsDeck,
                rowsDeckCard
            ];
        });
        return output;        
    }
    catch (error) {
        console.error("Error Inserting Deck");
        if (process.env.ENV !== "production")
            console.error(error);
        return null;
    }
}


export async function InsertGradedDeck(deck: Omit<DeckGraded, "deck_graded_id">, choices: [number, number][], readerID: string) {
    try {
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
                LIMIT   1;
            )
            RETURNING *
        `;
        
        if (!rowsDeckGraded.length)
            return null;
        
        const deckGradedCard = choices.map(choice => ({ deck_card_id: choice[0], choice: choice[1]}));
        const rowsDeckGradedCard = await db`
            INSERT INTO deck_card_graded ${db(deckGradedCard)}
            RETURNING *
        `;

        return [
            rowsDeckGraded,
            rowsDeckGradedCard
        ];
    }
    catch (error) {
        console.error("Error Inserting Graded Deck");
        if (process.env.ENV !== "production")
            console.error(error);
        return null;
    }
}


export async function DeleteDeck(deckID: number, readerID: string) {
    try {
        const rows = await db`
            DELETE FROM Deck
            WHERE   deck_id = ${deckID} AND
                    reader_id = ${readerID}
            RETURNING *
        `;
        return rows;
    }
    catch (error) {
        console.error("Error Deleting Deck");
        if (process.env.ENV !== "production")
            console.error(error);
        return null;
    }
}


export async function DeleteGradedDeck(deckGradedID: number, readerID: string) {
    try {
        const rows = await db`
            DELETE FROM     deck_graded
            JOIN    Deck
            ON      Deck.deck_id = deck_graded.deck_id
            WHERE   deck_graded_id = ${deckGradedID} AND
                    reader_id = ${readerID}
            RETURNING *
        `;
        return rows;
    }
    catch (error) {
        console.error("Error Deleting Graded Deck");
        if (process.env.ENV !== "production")
            console.error(error);
        return null;
    }
}


export async function UpdateDeck(deck: NullableBy<Deck, "deck_name" | "deck_chapters">) {
    try {
        const output = await db.begin(async (db: any) => {
            const rowsDeck = await db<Deck[]>`
                UPDATE  Deck
                SET     deck_name = COALESCE(${deck.deck_name ?? null}, deck_name)
                WHERE   deck_id = ${deck.deck_id} AND
                        reader_id = ${deck.reader_id}
                RETURNING *
            `;

            if (!rowsDeck || !rowsDeck.length)
                return null;

            if (!deck.deck_chapters || !deck.deck_chapters.length)
                return [rowsDeck];
            
            await db`
                DELETE FROM deck_card
                WHERE deck_id = ${deck.deck_id}
            `;
            
            const words = await SelectWordsFromChapters(deck.deck_chapters, deck.reader_id);
            
            if (!words || !words.length)
                return null;

            const cards = await Promise.all(words.map(async (word) => ({
                deck_id: deck.deck_id,
                words: [
                    word, 
                    ...await getRandomWords(word)
                ]
            })));

            if (!cards || !cards.length) 
                return null;

            const rowsDeckCard = await db`
                INSERT INTO deck_card ${db(cards)}
                RETURNING *
            `;

            return [
                rowsDeck,
                rowsDeckCard
            ];
        })
        return output;
    }
    catch (error) {
        console.error("Error Updating Deck");
        if (process.env.ENV !== "production")
            console.error(error);
        return null;
    }
}