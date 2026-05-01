import 'dotenv/config';
import type { NullableBy } from "../utilities/types.js";
import db from './db.js';
import { getRandomWords } from '../utilities/words.js';
import { SelectWord } from './word.js';


export type DeckQuestion = {
    type: string | null;
    words: [string, string][];
};


export interface Deck {
    deck_id: number;
    deck_name: string;
    deck_words: number[];
    deck_questions: DeckQuestion[];
    reader_id: string;
}


async function makeQuestions(wordIDs: number[], readerID: string) {
    const questions: DeckQuestion[] = await Promise.all(wordIDs.map(async (wordID) => {
        const [word] = await SelectWord(wordID, readerID);
        if (!word)
            throw new Error('Word DNE');

        const wordStr = word.word[0] as string;
        const wordDef = word.word[1] as string;
        const randWords = await getRandomWords(word.word[0], word.word[1]);

        return {
            type: null,
            words: [
                [wordStr, wordDef], 
                ...randWords
            ]
        };
    }));
    return questions;
}


export async function SelectDeck(deckID: number, readerID: string) {
    return await db<Deck[]>`
        SELECT  * 
        FROM    Deck 
        WHERE   deck_id = ${deckID} AND
                reader_id = ${readerID}
        LIMIT   1;
    `;
}


export async function SelectDecks(readerID: string) {
    return await db<Deck[]>`
        SELECT  * 
        FROM    Deck 
        WHERE   reader_id = ${readerID};
    `;
}


export async function SelectDecksByBooks(bookIDs: number[], readerID: string) {
    return await db<Deck[]>`
        SELECT  Deck.* 
        FROM    Deck 
        JOIN    Word        ON      Word.word_id = ANY(Deck.deck_words)
        JOIN    Chapter     ON      Chapter.chapter_id = Word.chapter_id
        JOIN    Book        ON      Book.book_id = Chapter.book_id
        WHERE   Book.reader_id = ${readerID} AND
                Book.book_id IN ${db(bookIDs)}
    `;
}


export async function SelectDecksByChapters(chapterIDs: number[], readerID: string) {
    return await db<Deck[]>`
        SELECT  Deck.* 
        FROM    Deck 
        JOIN    Word        ON      Word.word_id = ANY(Deck.deck_words)
        JOIN    Chapter     ON      Chapter.chapter_id = Word.chapter_id
        WHERE   Deck.reader_id = ${readerID} AND
                Chapter.chapter_id IN ${db(chapterIDs)}
    `;
}


export async function InsertDeck(deck: Omit<Deck, "deck_id" | "deck_questions">) {
    const questions = await makeQuestions(deck.deck_words, deck.reader_id);
    return await db<Deck[]>`
        INSERT INTO Deck (
            deck_name, 
            deck_words,
            deck_questions,
            reader_id
        )
        VALUES (
            ${deck.deck_name},
            ${deck.deck_words},
            ${db.array(questions.map(q => db.json(q)))},
            ${deck.reader_id}
        ) 
        RETURNING *
    `;
}


export async function DeleteDeck(deckID: number, readerID: string) {
    return await db`
        DELETE FROM Deck
        WHERE   deck_id = ${deckID} AND
                reader_id = ${readerID}
        RETURNING *
    `;
}


export async function UpdateDeck(deck: NullableBy<Deck, "deck_name" | "deck_words" | "deck_questions">) {
    const questions = deck.deck_words != null ? await makeQuestions(deck.deck_words, deck.reader_id) : null;
    return await db<Deck[]>`
        UPDATE  Deck
        SET     deck_name = COALESCE(${deck.deck_name ?? null}, deck_name),
                deck_words = COALESCE(${deck.deck_words ?? null}, deck_words),
                deck_questions = COALESCE(${questions != null ? db.array(questions.map(q => db.json(q))) : null}, deck_questions)
        WHERE   deck_id = ${deck.deck_id} AND
                reader_id = ${deck.reader_id}
        RETURNING *
    `;
}


export async function UpdateQuestions(deckID: number, readerID: string) {
    const [deck] = await SelectDeck(deckID, readerID);
    if (!deck)
        throw new Error('Select Failed');
    
    return await db<Deck[]>`
        UPDATE  Deck
        SET     deck_questions = ${db.array((await makeQuestions(deck.deck_words ?? [], deck.reader_id)).map(q => db.json(q)))}
        WHERE   deck_id = ${deck.deck_id} AND
                reader_id = ${deck.reader_id}
        RETURNING *
    `;
}