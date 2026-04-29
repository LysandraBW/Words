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


async function SelectWordsFromChapters(chapterIDs: number[], readerID: string) {
    try {
        const rows = await db`
            SELECT  Word
            FROM    Word
            JOIN    Chapter ON Word.chapter_id = Chapter.chapter_id
            JOIN    Book    ON Book.book_id = Chapter.book_id 
            WHERE   Book.reader_id = ${readerID} AND
                    Chapter.chapter_id = ANY(${db.array(chapterIDs)}::int[])
        `;

        if (!rows)
            throw 'Words Failed';

        return rows.map(row => row.word);
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
            await db<(Deck & DeckCard)[]>`
                SELECT  * 
                FROM    deck_card 
                JOIN    Deck        ON Deck.deck_id = deck_card.deck_id
                WHERE   Deck.deck_id = ${deckID} AND
                        Deck.reader_id = ${readerID};
            `
        ]);

        if (!rowsDeck || rowsDeck.length !== 1)
            return null;
        
        return {
            deck: rowsDeck[0],
            deckCards: rowsDeckCard
        };
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


export async function SelectDecksByBooks(bookIDs: number[], readerID: string) {
    try {
        const rows = await db<Deck[]>`
            SELECT  Deck.* 
            FROM    Deck 
            JOIN    Chapter     ON      Chapter.chapter_id = ANY(Deck.deck_chapters)
            JOIN    Book        ON      Book.book_id = Chapter.book_id
            WHERE   Book.reader_id = ${readerID} AND
                    Book.book_id IN ${db(bookIDs)}
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


export async function SelectDecksByChapters(chapterIDs: number[], readerID: string) {
    try {
        const rows = await db<Deck[]>`
            SELECT  Deck.* 
            FROM    Deck 
            JOIN    Chapter     ON      Chapter.chapter_id = ANY(Deck.deck_chapters)
            WHERE   Deck.reader_id = ${readerID} AND
                    Chapter.chapter_id IN ${db(chapterIDs)}
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


export async function InsertDeck(deck: Omit<Deck, "deck_id">) {
    try {
        return await db.begin(async (db: any) => {
            // Deck
            const [rowsDeck] = await db<Deck[]>`
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

            if (!rowsDeck || rowsDeck.length !== 1)
                throw 'Insert Failed';
            
            const deckID = rowsDeck[0].deck_id;

            // Words
            const words = await SelectWordsFromChapters(deck.deck_chapters, deck.reader_id);
            if (!words)
                throw 'Word Failed';
            
            // Words -> Cards
            const cards = await Promise.all(words.map(async (word) => ({
                deck_id: deckID,
                words: [word, ...await getRandomWords(word[0], word[1])]
            })));

            if (!cards || cards.length !== words.length)
                throw 'Card Failed';

            // Cards
            const rowsDeckCard = await db`
                INSERT INTO deck_card ${db(cards)}
                RETURNING *
            `;

            if (!rowsDeck || rowsDeckCard.length !== words.length)
                throw 'Deck Card Insert Failed';

            return {
                deck: rowsDeck[0],
                deckCards: rowsDeckCard
            };
        });       
    }
    catch (error) {
        console.error("Error Inserting Deck");
        if (process.env.ENV !== "production")
            console.error(error);
        return null;
    }
}


export async function DeleteDeck(deckID: number, readerID: string) {
    try {
        return await db.begin(async (db: any) => {
            const rows = await db`
                DELETE FROM Deck
                WHERE   deck_id = ${deckID} AND
                        reader_id = ${readerID}
                RETURNING *
            `;

            if (!rows || rows.length !== 1)
                throw 'Delete Failed';

            return rows[0];
        });
    }
    catch (error) {
        console.error("Error Deleting Deck");
        if (process.env.ENV !== "production")
            console.error(error);
        return null;
    }
}


export async function UpdateDeck(deck: NullableBy<Deck, "deck_name" | "deck_chapters">) {
    try {
        return await db.begin(async (db: any) => {
            // Deck
            const rowsDeck = await db<Deck[]>`
                UPDATE  Deck
                SET     deck_name = COALESCE(${deck.deck_name ?? null}, deck_name)
                WHERE   deck_id = ${deck.deck_id} AND
                        reader_id = ${deck.reader_id}
                RETURNING *
            `;

            if (!rowsDeck || rowsDeck.length !== 1)
                throw 'Update Failed';

            if (!deck.deck_chapters || !deck.deck_chapters.length)
                return {deck: rowsDeck[0]};
            
            // Delete Existing Cards
            await db`
                DELETE FROM deck_card
                WHERE deck_id = ${deck.deck_id}
            `;
            
            // Words
            const words = await SelectWordsFromChapters(deck.deck_chapters, deck.reader_id);
            if (!words || !words.length)
                throw 'Word Failed';

            // Words -> Cards
            const cards = await Promise.all(words.map(async (word) => ({
                deck_id: deck.deck_id,
                words: [word, ...await getRandomWords(word[0], word[1])]
            })));

            if (!cards || !cards.length) 
                throw 'Card Failed'

            const rowsDeckCard = await db`
                INSERT INTO deck_card ${db(cards)}
                RETURNING *
            `;

            if (!rowsDeckCard || rowsDeckCard.length !== words.length)
                throw 'Insert Failed';
            
            return {
                deck: rowsDeck[0],
                deckCards: rowsDeckCard
            };
        });
    }
    catch (error) {
        console.error("Error Updating Deck");
        if (process.env.ENV !== "production")
            console.error(error);
        return null;
    }
}


export async function ReloadDeck(deckID: number, readerID: string) {
    try {
        return await db.begin(async (db: any) => {
            // Delete Existing Cards
            await db`
                DELETE FROM deck_card
                WHERE deck_id = ${deckID}
            `;
            
            const [deckChapters] = (await db`
                SELECT deck_chapters
                FROM Deck
                WHERE deck_id = ${deckID}
                LIMIT 1;
            `);

            if (!deckChapters)
                throw 'Chapters Failed';

            // Words
            const words = await SelectWordsFromChapters(deckChapters.deck_chapters, readerID);
            if (!words)
                throw 'Word Failed';

            // Words -> Cards
            const cards = await Promise.all(words.map(async (word) => ({
                deck_id: deckID,
                words: [word, ...await getRandomWords(word[0], word[1])]
            })));

            if (!cards) 
                throw 'Card Failed';

            // Cards
            const rowsDeckCard = await db`
                INSERT INTO deck_card ${db(cards)}
                RETURNING *
            `;
            
            if (!rowsDeckCard || rowsDeckCard.length !== words.length)
                throw 'Insert Failed';
            
            return rowsDeckCard;
        });
    }
    catch (error) {
        console.error("Error Updating Deck");
        if (process.env.ENV !== "production")
            console.error(error);
        return null;
    }
}