import { type Request, type Response } from 'express';
import { getCookie } from '../utilities/cookie.js';
import { AuthorizeReaderBySession } from '../db/reader.js';
import z from 'zod';
import { DeleteBook, InsertBook, SelectBook, SelectBooks, UpdateBook } from '../db/book.js';
import { SelectChaptersFromBook } from '../db/chapter.js';
import { SelectWordsFromBook } from '../db/word.js';
import { nullableBy } from '../utilities/types.js';
import { SelectDecksByBooks } from '../db/deck.js';
import { SelectGradedDecksByBooks } from '../db/deckGraded.js';


const BookSchema = z.object({
    book_id: z.coerce.number(),
    book_name: z.string(),
    book_cover_image: z.url().nullish(),
    book_background_image: z.url().nullish(),
    book_year: z.coerce.number().nullish(),
    book_author: z.array(z.string()).nullish(),
    reader_id: z.uuidv7()
});


export async function getBook(req: Request, res: Response) {
    const sessionID = await getCookie(req, "sessionID");
    if (!sessionID)
        return res.sendStatus(401);

    const output = BookSchema.pick({ book_id: true, reader_id: true }).safeParse({
        book_id: req.params.book_id,
        reader_id: await AuthorizeReaderBySession(sessionID)
    });

    if (!output.success) {
        console.error(output.error);
        return res.sendStatus(400);
    }

    const book = await SelectBook(output.data.book_id, output.data.reader_id);
    return res.status(200).json(book);
}


export async function getBookChapters(req: Request, res: Response) {
    const sessionID = await getCookie(req, "sessionID");
    if (!sessionID)
        return res.sendStatus(401);

    const output = BookSchema.pick({ book_id: true, reader_id: true }).safeParse({
        book_id: req.params.book_id,
        reader_id: await AuthorizeReaderBySession(sessionID)
    });

    if (!output.success) {
        console.error(output.error);
        return res.sendStatus(400);
    }
    
    const chapters = await SelectChaptersFromBook(output.data.book_id, output.data.reader_id);
    return res.status(200).json(chapters);
}


export async function getBookWords(req: Request, res: Response) {
    const sessionID = await getCookie(req, "sessionID");
    if (!sessionID)
        return res.sendStatus(401);

    const output = BookSchema.pick({ book_id: true, reader_id: true }).safeParse({
        book_id: req.params.book_id,
        reader_id: await AuthorizeReaderBySession(sessionID)
    });

    if (!output.success) {
        console.error(output.error);
        return res.sendStatus(400);
    }
    
    const words = await SelectWordsFromBook(output.data.book_id, output.data.reader_id);
    return res.status(200).json(words);
}


export async function getBookDecks(req: Request, res: Response) {
    const sessionID = await getCookie(req, "sessionID");
    if (!sessionID)
        return res.sendStatus(401);

    const output = BookSchema.pick({ book_id: true, reader_id: true }).safeParse({
        book_id: req.params.book_id,
        reader_id: await AuthorizeReaderBySession(sessionID)
    });

    if (!output.success) {
        console.error(output.error);
        return res.sendStatus(400);
    }
    
    const words = await SelectDecksByBooks([output.data.book_id], output.data.reader_id);
    return res.status(200).json(words);
}


export async function getBookGradedDecks(req: Request, res: Response) {
    const sessionID = await getCookie(req, "sessionID");
    if (!sessionID)
        return res.sendStatus(401);
    
    const output = BookSchema.pick({ book_id: true, reader_id: true }).safeParse({
        book_id: req.params.book_id,
        reader_id: await AuthorizeReaderBySession(sessionID)
    });

    if (!output.success) {
        console.error(output.error);
        return res.sendStatus(400);
    }

    const decks = await SelectGradedDecksByBooks([output.data.book_id], output.data.reader_id);
    return res.status(200).json(decks);  
}


export async function getBooks(req: Request, res: Response) {
    const sessionID = await getCookie(req, "sessionID");
    if (!sessionID)
        return res.sendStatus(401);

    const output = BookSchema.pick({ reader_id: true }).safeParse({
        reader_id: await AuthorizeReaderBySession(sessionID)
    });

    if (!output.success) {
        console.error(output.error);
        return res.sendStatus(400);
    }
    
    const books = await SelectBooks(output.data.reader_id);
    return res.status(200).json(books);
}


export async function createBook(req: Request, res: Response) {
    const sessionID = await getCookie(req, "sessionID");
    if (!sessionID)
        return res.sendStatus(401);
    
    const output = BookSchema.omit({ book_id: true }).safeParse({
        book_name: req.body.book_name,
        book_cover_image: req.body.book_cover_image,
        book_background_image: req.body.book_background_image,
        book_year: req.body.book_year,
        book_author: req.body.book_author,
        reader_id: await AuthorizeReaderBySession(sessionID)
    });

    if (!output.success) {
        console.error(output.error);
        return res.sendStatus(400);
    }
    
    const book = await InsertBook(output.data);
    return res.status(200).json(book);
}


export async function updateBook(req: Request, res: Response) {
    const sessionID = await getCookie(req, "sessionID");
    if (!sessionID)
        return res.sendStatus(401);
    
    const output = nullableBy(BookSchema, ["book_name", "book_author", "book_cover_image", "book_background_image", "book_year"]).safeParse({
        book_id: req.body.book_id,
        book_name: req.body.book_name,
        book_cover_image: req.body.book_cover_image,
        book_background_image: req.body.book_background_image,
        book_year: req.body.book_year,
        book_author: req.body.book_author,
        reader_id: await AuthorizeReaderBySession(sessionID)
    });

    if (!output.success) {
        console.error(output.error);
        return res.sendStatus(400);
    }
    
    const books = await UpdateBook(output.data);
    return res.status(200).json(books);
}


export async function deleteBook(req: Request, res: Response) {
    const sessionID = await getCookie(req, "sessionID");
    if (!sessionID)
        return res.sendStatus(401);

    const output = BookSchema.pick({ book_id: true, reader_id: true}).safeParse({
        book_id: req.params.book_id,
        reader_id: await AuthorizeReaderBySession(sessionID)
    });

    if (!output.success) {
        console.error(output.error);
        return res.sendStatus(400);
    }

    const deleted = await DeleteBook(output.data.book_id, output.data.reader_id);
    return res.status(200).json(deleted);
}