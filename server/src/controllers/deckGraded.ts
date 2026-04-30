import z from 'zod';
import { getCookie } from '../utilities/cookie.js';
import { type Request, type Response } from 'express';
import { AuthorizeReaderBySession } from '../db/reader.js';
import { DeleteGradedDeck, InsertGradedDeck, SelectGradedDeck, SelectGradedDecks, SelectGradedDecksByBooks, SelectGradedDecksByChapters, SelectGradedDecksByDeck } from '../db/deckGraded.js';
import '../db/deck.js';
import { DeckSchema } from './deck.js';


export const DeckGradedSchema = z.object({
    deck_graded_id: z.coerce.number(),
    duration: z.coerce.number(),
    number_correct: z.coerce.number(),
    number_incorrect: z.coerce.number(),
    deck_questions: z.array(z.object({
        type: z.string().nullable(),
        words: z.array(z.tuple([z.string().trim().min(1), z.string().trim().min(1)])),
        choice: z.coerce.number().min(0)
    })),
    deck_id: z.coerce.number(),
    reader_id: z.uuidv7()
});


export async function getGradedDeck(req: Request, res: Response) {
    try {
        const sessionID = await getCookie(req, "sessionID");
        if (!sessionID)
            return res.sendStatus(401);
        
        const output = DeckGradedSchema.pick({ deck_graded_id: true, reader_id: true }).safeParse({
            deck_graded_id: req.params.deck_graded_id,
            reader_id: await AuthorizeReaderBySession(sessionID)
        });

        if (!output.success) {
            console.error(output.error);
            return res.sendStatus(400);
        }

        const deck = await SelectGradedDeck(output.data.deck_graded_id, output.data.reader_id);
        return res.status(200).json(deck); 
        
    }
    catch (error) {
        console.error("Error");
        if (process.env.ENV !== "production")
            console.error(error);
        return res.status(500);
    }
}


export async function getGradedDecksByDeck(req: Request, res: Response) {
    try {
        const sessionID = await getCookie(req, "sessionID");
        if (!sessionID)
            return res.sendStatus(401);
        
        const output = DeckGradedSchema.pick({ deck_id: true, reader_id: true }).safeParse({
            deck_id: req.params.deck_id,
            reader_id: await AuthorizeReaderBySession(sessionID)
        });

        if (!output.success) {
            console.error(output.error);
            return res.sendStatus(400);
        }

        const gradedDecks = await SelectGradedDecksByDeck(output.data.deck_id, output.data.reader_id);
        return res.status(200).json(gradedDecks);
    }
    catch (error) {
        console.error("Error");
        if (process.env.ENV !== "production")
            console.error(error);
        return res.status(500);
    }
    
    
}


export async function getGradedDecks(req: Request, res: Response) {
    try {
        const sessionID = await getCookie(req, "sessionID");
        if (!sessionID)
            return res.sendStatus(401);
        
        const output = DeckGradedSchema.pick({ reader_id: true }).safeParse({
            reader_id: await AuthorizeReaderBySession(sessionID)
        });

        if (!output.success) {
            console.error(output.error);
            return res.sendStatus(400);
        }

        const gradedDecks = await SelectGradedDecks(output.data.reader_id);
        return res.status(200).json(gradedDecks);
    }
    catch (error) {
        console.error("Error");
        if (process.env.ENV !== "production")
            console.error(error);
        return res.status(500);
    }
    
    
}


export async function getGradedDecksByBooks(req: Request, res: Response) {
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

        const decks = await SelectGradedDecksByBooks(output.data.book_ids, output.data.reader_id);
        return res.status(200).json(decks);  
    }
    catch (error) {
        console.error("Error");
        if (process.env.ENV !== "production")
            console.error(error);
        return res.status(500);
    }
    
    
}


export async function getGradedDecksByChapters(req: Request, res: Response) {
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

        const decks = await SelectGradedDecksByChapters(output.data.chapter_ids, output.data.reader_id);
        return res.status(200).json(decks);  
    }
    catch (error) {
        console.error("Error");
        if (process.env.ENV !== "production")
            console.error(error);
        return res.status(500);
    }
    
    
}


export async function createGradedDeck(req: Request, res: Response) {
    try {
        const sessionID = await getCookie(req, "sessionID");
        if (!sessionID)
            return res.sendStatus(401);

        const output = DeckGradedSchema.omit({ 
            deck_graded_id: true 
        }).safeParse({
            deck_questions: req.body.deck_questions,
            number_correct: req.body.number_correct,
            number_incorrect: req.body.number_incorrect,
            duration: req.body.duration,
            deck_id: req.body.deck_id,
            reader_id: await AuthorizeReaderBySession(sessionID)
        });

        if (!output.success) {
            console.error(output.error);
            return res.sendStatus(400);
        }
        
        const deck = await InsertGradedDeck(output.data, output.data.reader_id);
        return res.status(200).json(deck);
    }
    catch (error) {
        console.error("Error");
        if (process.env.ENV !== "production")
            console.error(error);
        return res.status(500);
    }
    
    
}


export async function deleteGradedDeck(req: Request, res: Response) {
    try {
        const sessionID = await getCookie(req, "sessionID");
        if (!sessionID)
            return res.sendStatus(401);

        const output = DeckGradedSchema.pick({ deck_graded_id: true, reader_id: true}).safeParse({
            deck_graded_id: req.params.deck_graded_id,
            reader_id: await AuthorizeReaderBySession(sessionID)
        });

        if (!output.success) {
            console.error(output.error);
            return res.sendStatus(400);
        }

        const deleted = await DeleteGradedDeck(output.data.deck_graded_id, output.data.reader_id);
        return res.status(200).json(deleted);
    }
    catch (error) {
        console.error("Error");
        if (process.env.ENV !== "production")
            console.error(error);
        return res.status(500);
    }
    
    
}