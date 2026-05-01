import z from 'zod';
import { getCookie } from '../utilities/cookie.js';
import { nullableBy } from '../utilities/types.js';
import { type Request, type Response } from 'express';
import { AuthorizeReaderBySession } from '../db/reader.js';
import { DeleteDeck, InsertDeck, UpdateQuestions as UpdateQuestions, SelectDeck, SelectDecks, SelectDecksByBooks, UpdateDeck, SelectDecksByChapters } from '../db/deck.js';
import '../db/deck.js';
import { SelectGradedDecksByDeck } from '../db/deckGraded.js';
import { SelectWordsFromDeck } from '../db/word.js';


export const DeckSchema = z.object({
    deck_id: z.coerce.number(),
    deck_name: z.string(),
    deck_words: z.array(z.coerce.number()),
    deck_questions: z.array(z.object({
        type: z.string().nullable(),
        words: z.array(z.tuple([z.string().trim().min(1), z.string().trim().min(1)]))
    })),
    reader_id: z.uuidv7()
});


export async function getDeck(req: Request, res: Response) {
    try {
        const sessionID = await getCookie(req, "sessionID");
        if (!sessionID)
            return res.sendStatus(401);
        
        const output = DeckSchema.pick({ deck_id: true, reader_id: true }).safeParse({
            deck_id: req.params.deck_id,
            reader_id: await AuthorizeReaderBySession(sessionID)
        });

        if (!output.success) {
            console.error(output.error);
            return res.sendStatus(400);
        }

        const [deck] = await SelectDeck(output.data.deck_id, output.data.reader_id);
        return res.status(200).json(deck);
    }
    catch (error) {
        console.error("Error");
        if (process.env.ENV !== "production")
            console.error(error);
        return res.status(500);
    }    
}


export async function getDeckGradedDecks(req: Request, res: Response) {
    try {
        const sessionID = await getCookie(req, "sessionID");
        if (!sessionID)
            return res.sendStatus(401);
        
        const output = DeckSchema.pick({ deck_id: true, reader_id: true }).safeParse({
            deck_id: req.params.deck_id,
            reader_id: await AuthorizeReaderBySession(sessionID)
        });

        if (!output.success) {
            console.error(output.error);
            return res.sendStatus(400);
        }

        const decks = await SelectGradedDecksByDeck(output.data.deck_id, output.data.reader_id);
        return res.status(200).json(decks);
    }
    catch (error) {
        console.error("Error");
        if (process.env.ENV !== "production")
            console.error(error);
        return res.status(500);
    }  
}


export async function getDeckWords(req: Request, res: Response) {
    try {
        const sessionID = await getCookie(req, "sessionID");
        if (!sessionID)
            return res.sendStatus(401);
        
        const output = DeckSchema.pick({ deck_id: true, reader_id: true }).safeParse({
            deck_id: req.params.deck_id,
            reader_id: await AuthorizeReaderBySession(sessionID)
        });
        
        if (!output.success) {
            console.error(output.error);
            return res.sendStatus(400);
        }
        
        const words = await SelectWordsFromDeck(output.data.deck_id, output.data.reader_id);
        return res.status(200).json(words);
    }
    catch (error) {
        console.error("Error");
        if (process.env.ENV !== "production")
            console.error(error);
        return res.status(500);
    }
}


export async function getDecks(req: Request, res: Response) {
    try {
        const sessionID = await getCookie(req, "sessionID");
        if (!sessionID)
            return res.sendStatus(401);
        
        const output = DeckSchema.pick({ reader_id: true }).safeParse({
            reader_id: await AuthorizeReaderBySession(sessionID)
        });

        if (!output.success) {
            console.error(output.error);
            return res.sendStatus(400);
        }

        const decks = await SelectDecks(output.data.reader_id);
        return res.status(200).json(decks);  
    }
    catch (error) {
        console.error("Error");
        if (process.env.ENV !== "production")
            console.error(error);
        return res.status(500);
    }
}


export async function getDecksByBooks(req: Request, res: Response) {
    try {
        const sessionID = await getCookie(req, "sessionID");
        if (!sessionID)
            return res.sendStatus(401);
        
        const output = DeckSchema.pick({ 
            reader_id: true 
        }).extend({
            book_ids: z.array(z.coerce.number())
        }).safeParse({
            book_ids: req.body.bookIDs,
            reader_id: await AuthorizeReaderBySession(sessionID)
        });

        if (!output.success) {
            console.error(output.error);
            return res.sendStatus(400);
        }

        const decks = await SelectDecksByBooks(output.data.book_ids, output.data.reader_id);
        return res.status(200).json(decks);  
    }
    catch (error) {
        console.error("Error");
        if (process.env.ENV !== "production")
            console.error(error);
        return res.status(500);
    }
}


export async function getDecksByChapters(req: Request, res: Response) {
    try {
        const sessionID = await getCookie(req, "sessionID");
        if (!sessionID)
            return res.sendStatus(401);
        
        const output = DeckSchema.pick({ 
            reader_id: true 
        }).extend({
            chapter_ids: z.array(z.coerce.number())
        }).safeParse({
            chapter_ids: req.body.chapterIDs,
            reader_id: await AuthorizeReaderBySession(sessionID)
        });

        if (!output.success) {
            console.error(output.error);
            return res.sendStatus(400);
        }

        const decks = await SelectDecksByChapters(output.data.chapter_ids, output.data.reader_id);
        return res.status(200).json(decks);  
    }
    catch (error) {
        console.error("Error");
        if (process.env.ENV !== "production")
            console.error(error);
        return res.status(500);
    }
}


export async function createDeck(req: Request, res: Response) {
    try {
        const sessionID = await getCookie(req, "sessionID");
        if (!sessionID)
            return res.sendStatus(401);

        const output = DeckSchema.omit({ deck_id: true, deck_questions: true }).safeParse({
            deck_name: req.body.deck_name,
            deck_words: req.body.deck_words,
            reader_id: await AuthorizeReaderBySession(sessionID)
        });

        if (!output.success) {
            console.error(output.error);
            return res.sendStatus(400);
        }
        
        const [deck] = await InsertDeck(output.data);
        return res.status(200).json(deck);
    }
    catch (error) {
        console.error("Error");
        if (process.env.ENV !== "production")
            console.error(error);
        return res.status(500);
    }
}


export async function updateDeck(req: Request, res: Response) {
    try {
        const sessionID = await getCookie(req, "sessionID");
        if (!sessionID)
            return res.sendStatus(401);

        const output = nullableBy(DeckSchema, ["deck_name", "deck_words"]).omit({ 
            deck_questions: true 
        }).safeParse({
            deck_id: req.params.deck_id,
            deck_name: req.body.deck_name,
            deck_words: req.body.deck_words,
            reader_id: await AuthorizeReaderBySession(sessionID)
        });

        if (!output.success) {
            console.error(output.error);
            return res.sendStatus(400);
        }
        
        const [deck] = await UpdateDeck(output.data);
        return res.status(200).json(deck);
    }
    catch (error) {
        console.error("Error");
        if (process.env.ENV !== "production")
            console.error(error);
        return res.status(500);
    }
}



export async function deleteDeck(req: Request, res: Response) {
    try {
        const sessionID = await getCookie(req, "sessionID");
        if (!sessionID)
            return res.sendStatus(401);

        const output = DeckSchema.pick({ deck_id: true, reader_id: true}).safeParse({
            deck_id: req.params.deck_id,
            reader_id: await AuthorizeReaderBySession(sessionID)
        });

        if (!output.success) {
            console.error(output.error);
            return res.sendStatus(400);
        }

        const [deleted] = await DeleteDeck(output.data.deck_id, output.data.reader_id);
        return res.status(200).json(deleted);
    }
    catch (error) {
        console.error("Error");
        if (process.env.ENV !== "production")
            console.error(error);
        return res.status(500);
    }    
}


export async function reloadDeck(req: Request, res: Response) {
    try {
        const sessionID = await getCookie(req, "sessionID");
        if (!sessionID)
            return res.sendStatus(401);

        const output = DeckSchema.pick({ deck_id: true, reader_id: true }).safeParse({
            deck_id: req.params.deck_id,
            reader_id: await AuthorizeReaderBySession(sessionID)
        });

        if (!output.success) {
            console.error(output.error);
            return res.sendStatus(400);
        }
        
        const [deck] = await UpdateQuestions(output.data.deck_id, output.data.reader_id);
        return res.status(200).json(deck);
    }
    catch (error) {
        console.error("Error");
        if (process.env.ENV !== "production")
            console.error(error);
        return res.status(500);
    }   
}