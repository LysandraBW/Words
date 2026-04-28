import z from 'zod';
import { getCookie } from '../utilities/cookie.js';
import { nullableBy } from '../utilities/types.js';
import { type Request, type Response } from 'express';
import { AuthorizeReaderBySession } from '../db/reader.js';
import { DeleteDeck, InsertDeck, ReloadDeck as ReloadDeck, SelectDeck, SelectDecks, SelectDecksByBooks, UpdateDeck, SelectDecksByChapters } from '../db/deck.js';
import '../db/deck.js';
import { SelectGradedDecksByDeck } from '../db/deckGraded.js';


export const DeckSchema = z.object({
    deck_id: z.coerce.number(),
    deck_name: z.string(),
    deck_chapters: z.array(z.coerce.number()),
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

    const deck = await SelectDeck(output.data.deck_id, output.data.reader_id);
    return res.status(200).json(deck);
}


export async function getDeckGradedDecks(req: Request, res: Response) {
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

    const decks = await SelectDecks(output.data.reader_id);
    return res.status(200).json(decks);  
}


export async function getDecksByBooks(req: Request, res: Response) {
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


export async function getDecksByChapters(req: Request, res: Response) {
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


export async function reloadDeck(req: Request, res: Response) {
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
    
    const books = await ReloadDeck(output.data.deck_id, output.data.reader_id);
    return res.status(200).json(books);
}