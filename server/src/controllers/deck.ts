import z from 'zod';
import { getCookie } from '../utilities/cookie.js';
import { nullableBy } from '../utilities/types.js';
import { type Request, type Response } from 'express';
import { AuthorizeReaderBySession } from '../db/reader.js';
import { DeleteDeck, DeleteGradedDeck, InsertDeck, InsertGradedDeck, SelectDeck, SelectDecks, SelectGradedDeck, SelectGradedDecks, UpdateDeck } from '../db/deck.js';
import '../db/deck.js';

const DeckSchema = z.object({
    deck_id: z.coerce.number(),
    deck_name: z.string(),
    deck_chapters: z.array(z.coerce.number()),
    reader_id: z.uuidv7()
});



const DeckGradedSchema = z.object({
    deck_graded_id: z.coerce.number(),
    duration: z.coerce.number(),
    number_correct: z.coerce.number(),
    number_incorrect: z.coerce.number(),
    deck_id: z.coerce.number(),
    reader_id: z.uuidv7()
});



export async function getDeck(req: Request, res: Response) {
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

    const deck = SelectDeck(output.data.deck_id, output.data.reader_id);
    return res.status(200).json(deck);
}



export async function getGradedDeck(req: Request, res: Response) {
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

    const deck = SelectGradedDeck(output.data.deck_graded_id, output.data.reader_id);
    return res.status(200).json(deck); 
}



export async function getDecks(req: Request, res: Response) {
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

    const decks = SelectDecks(output.data.reader_id);
    return res.status(200).json(decks);  
}



export async function getGradedDecks(req: Request, res: Response) {
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

    const gradedDecks = SelectGradedDecks(output.data.reader_id);
    return res.status(200).json(gradedDecks);
}



export async function createDeck(req: Request, res: Response) {
    const sessionID = await getCookie(req, "sessionID");
    if (!sessionID)
        return res.sendStatus(401);

    const output = DeckSchema.omit({ deck_id: true }).safeParse({
        deck_name: req.body.deck_name,
        deck_chapters: req.body.deck_chapters,
        reader_id: await AuthorizeReaderBySession(sessionID)
    });

    if (!output.success) {
        console.error(output.error);
        return res.sendStatus(400);
    }
    
    const deck = await InsertDeck(output.data);
    return res.status(200).json(deck);
}



export async function createGradedDeck(req: Request, res: Response) {
    const sessionID = await getCookie(req, "sessionID");
    if (!sessionID)
        return res.sendStatus(401);

    const output = DeckGradedSchema.omit({ 
        deck_graded_id: true 
    }).extend({
        choices: z.array(z.tuple([
            z.coerce.number(), 
            z.coerce.number()
        ]))
    }).safeParse({
        choices: req.body.choices,
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
    
    const deck = await InsertGradedDeck(output.data, output.data.choices, output.data.reader_id);
    return res.status(200).json(deck);
}



export async function updateDeck(req: Request, res: Response) {
    const sessionID = await getCookie(req, "sessionID");
    if (!sessionID)
        return res.sendStatus(401);

    const output = nullableBy(DeckSchema, ["deck_name", "deck_chapters"]).safeParse({
        deck_id: req.params.deck_id,
        deck_name: req.body.deck_name,
        deck_chapters: req.body.deck_chapters,
        reader_id: await AuthorizeReaderBySession(sessionID)
    });

    if (!output.success) {
        console.error(output.error);
        return res.sendStatus(400);
    }
    
    const books = await UpdateDeck(output.data);
    return res.status(200).json(books);
}



export async function deleteDeck(req: Request, res: Response) {
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

    const deleted = await DeleteDeck(output.data.deck_id, output.data.reader_id);
    return res.status(200).json(deleted);
}



export async function deleteGradedDeck(req: Request, res: Response) {
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