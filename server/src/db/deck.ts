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

        if (!rows)
            return null;

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
            await db<DeckCard[]>`
                SELECT  * 
                FROM    deck_card 
                JOIN    Deck        ON Deck.deck_id = deck_card.deck_id
                WHERE   Deck.deck_id = ${deckID} AND
                        Deck.reader_id = ${readerID};
            `
        ]);

        if (!rowsDeck || rowsDeck.length !== 1)
            return null;
        
        return [
            rowsDeck[0],
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
                        EXISTS (
                            SELECT  1
                            FROM    Deck
                            WHERE   Deck.deck_id = Deck_Graded.deck_id AND
                                    Deck.reader_id = ${readerID}
                            LIMIT   1
                        )
                LIMIT   1;
            `,
            await db<DeckCardGraded[]>`
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

        return [
            rowsDeck[0],
            rowsDeckCard
        ];
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
        const rows = await db<DeckGraded[]>`
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


export async function SelectDecksGradedDecks(deckID: number, readerID: string) {
    try {
        const rows = await db<DeckGraded[]>`
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


export async function InsertDeck(deck: Omit<Deck, "deck_id">) {
    try {
        return await db.begin(async (db: any) => {
            // Deck
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

            if (!rowsDeck || rowsDeck.length !== 1)
                throw 'Insert Failed';


            // Words
            const words = await SelectWordsFromChapters(deck.deck_chapters, deck.reader_id);
            
            if (!words)
                throw 'Word Selection Failed';
            

            // Words -> Cards
            const cards = await Promise.all(words.map(async (word) => ({
                deck_id: (rowsDeck[0] as any).deck_id,
                words: [
                    word, 
                    ...await getRandomWords(word[0], word[1])
                ]
            })));

            if (!cards || cards.length !== words.length)
                throw 'Card Creation Failed';

            // Cards
            const rowsDeckCard = await db`
                INSERT INTO deck_card ${db(cards)}
                RETURNING *
            `;

            if (!rowsDeck || rowsDeckCard.length !== words.length)
                throw 'Deck Card Insert Failed';

            return [
                rowsDeck[0],
                rowsDeckCard
            ];
        });       
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

            return [
                rowsDeckGraded[0],
                rowsDeckGradedCard
            ];
        });
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
                return [rowsDeck[0]];
            
            await db`
                DELETE FROM deck_card
                WHERE deck_id = ${deck.deck_id}
            `;
            
            
            // Words
            const words = await SelectWordsFromChapters(deck.deck_chapters, deck.reader_id);
            
            if (!words || !words.length)
                throw 'Word Selection Failed';


            // Words -> Cards
            const cards = await Promise.all(words.map(async (word) => ({
                deck_id: deck.deck_id,
                words: [
                    word, 
                    ...await getRandomWords(word[0], word[1])
                ]
            })));

            if (!cards || !cards.length) 
                throw 'Card Creation Failed'

            const rowsDeckCard = await db`
                INSERT INTO deck_card ${db(cards)}
                RETURNING *
            `;

            if (!rowsDeckCard || rowsDeckCard.length !== words.length)
                throw 'Insert Failed';
            
            return [
                rowsDeck[0],
                rowsDeckCard
            ];
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
                throw 'Deck Chapter Selection Failed';

            
            // Words
            const words = await SelectWordsFromChapters(
                deckChapters.deck_chapters, 
                readerID
            );

            if (!words || !words.length)
                throw 'Word Selection Failed';


            // Words -> Cards
            const cards = await Promise.all(words.map(async (word) => ({
                deck_id: deckID,
                words: [
                    word, 
                    ...await getRandomWords(word[0], word[1])
                ]
            })));

            if (!cards || !cards.length) 
                throw 'Card Creation Failed'


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