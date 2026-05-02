import { type Request, type Response } from 'express';
import { getCookie } from '../utilities/cookie.js';
import { AuthorizeReaderBySession } from '../db/reader.js';
import z from 'zod';
import { DeleteBook, InsertBook, SelectBook, SelectBooks, UpdateBook } from '../db/book.js';
import { SelectChaptersFromBook } from '../db/chapter.js';
import { SelectWordsFromBook } from '../db/word.js';
import { emptyStringToNull, nullableBy } from '../utilities/types.js';
import { SelectDecksByBooks } from '../db/deck.js';
import { SelectGradedDecksByBooks } from '../db/deckGraded.js';


const BookSchema = z.object({
    book_id: z.coerce.number(),
    book_name: z.string(),
    book_cover_image: z.preprocess(
        emptyStringToNull, 
        z.url().nullish()
    ),
    book_background_image: z.preprocess(
        emptyStringToNull, 
        z.url().nullish()
    ),
    book_year: z.preprocess(
        emptyStringToNull, 
        z.coerce.number().nullish()
    ),
    background_color: z.preprocess(
        emptyStringToNull, 
        z.string().trim().min(1)
    ),
    foreground_color: z.preprocess(
        emptyStringToNull, 
        z.string().trim().min(1)
    ),
    book_author: z.array(z.string()).nullish(),
    reader_id: z.uuidv7()
});


export async function getBook(req: Request, res: Response) {
    try {
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

        const [book] = await SelectBook(output.data.book_id, output.data.reader_id);
        if (!book)
            throw new Error('Select Failed');

        return res.status(200).json(book);
    }
    catch (error) {
        console.error("Error");
        if (process.env.ENV !== "production")
            console.error(error);
        return res.status(500);
    }
}


export async function getBookChapters(req: Request, res: Response) {
    try {
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
        if (!chapters)
            throw new Error('Select Failed');

        return res.status(200).json(chapters);
    }
    catch (error) {
        console.error("Error");
        if (process.env.ENV !== "production")
            console.error(error);
        return res.status(500);
    }
}


export async function getBookWords(req: Request, res: Response) {
    try {
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
        if (!words)
            throw new Error('Select Failed');

        return res.status(200).json(words);
    }
    catch (error) {
        console.error("Error");
        if (process.env.ENV !== "production")
            console.error(error);
        return res.status(500);
    }
}


export async function getBookDecks(req: Request, res: Response) {
    try {
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
        
        const decks = await SelectDecksByBooks([output.data.book_id], output.data.reader_id);
        if (!decks)
            throw new Error('Select Failed');

        return res.status(200).json(decks);
    }
    catch (error) {
        console.error("Error");
        if (process.env.ENV !== "production")
            console.error(error);
        return res.status(500);
    }
}


export async function getBookGradedDecks(req: Request, res: Response) {
    try {
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
        if (!decks)
            throw new Error('Select Failed');

        return res.status(200).json(decks);  
    }
    catch (error) {
        console.error("Error");
        if (process.env.ENV !== "production")
            console.error(error);
        return res.status(500);
    }
}


export async function getBooks(req: Request, res: Response) {
    try {
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
        if (!books)
            throw new Error('Select Failed');

        return res.status(200).json(books);
    }
    catch (error) {
        console.error("Error");
        if (process.env.ENV !== "production")
            console.error(error);
        return res.status(500);
    }
}


export async function createBook(req: Request, res: Response) {
    try {
        const sessionID = await getCookie(req, "sessionID");
        if (!sessionID)
            return res.sendStatus(401);
        
        const output = BookSchema.omit({ book_id: true }).safeParse({
            book_name: req.body.book_name,
            book_cover_image: req.body.book_cover_image,
            book_background_image: req.body.book_background_image,
            background_color: req.body.background_color,
            foreground_color: req.body.foreground_color,
            book_year: req.body.book_year,
            book_author: req.body.book_author,
            reader_id: await AuthorizeReaderBySession(sessionID)
        });

        if (!output.success) {
            console.error(output.error);
            return res.sendStatus(400);
        }
        
        const [book] = await InsertBook(output.data);
        if (!book)
            throw new Error('Create Failed');

        return res.status(200).json(book);
    }
    catch (error) {
        console.error("Error");
        if (process.env.ENV !== "production")
            console.error(error);
        return res.status(500);
    }
}


export async function updateBook(req: Request, res: Response) {
    try {
        const sessionID = await getCookie(req, "sessionID");
        if (!sessionID)
            return res.sendStatus(401);
        
        const output = nullableBy(BookSchema, ["book_name", "book_author", "book_cover_image", "book_background_image", "book_year", "background_color", "foreground_color"]).safeParse({
            book_id: req.body.book_id,
            book_name: req.body.book_name,
            book_cover_image: req.body.book_cover_image,
            book_background_image: req.body.book_background_image,
            book_year: req.body.book_year,
            book_author: req.body.book_author,
            background_color: req.body.background_color,
            foreground_color: req.body.foreground_color,
            reader_id: await AuthorizeReaderBySession(sessionID)
        });

        if (!output.success) {
            console.error(output.error);
            return res.sendStatus(400);
        }
        
        const [book] = await UpdateBook(output.data);
        if (!book)
            throw new Error('Update Failed');

        return res.status(200).json(book);
    }
    catch (error) {
        console.error("Error");
        if (process.env.ENV !== "production")
            console.error(error);
        return res.status(500);
    }
}


export async function deleteBook(req: Request, res: Response) {
    try {
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

        const [book] = await DeleteBook(output.data.book_id, output.data.reader_id);
        if (!book)
            throw new Error('Delete Failed');

        return res.status(200).json(book);
    }
    catch (error) {
        console.error("Error");
        if (process.env.ENV !== "production")
            console.error(error);
        return res.status(500);
    }
}