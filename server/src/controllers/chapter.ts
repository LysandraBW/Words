import { type Request, type Response } from 'express';
import z from 'zod';
import { getCookie } from '../utilities/cookie.js';
import { AuthorizeReaderBySession } from '../db/reader.js';
import { DeleteChapter, InsertChapter, SelectChapter, SelectChapters, UpdateChapter } from '../db/chapter.js';
import { SelectWordsFromChapter } from '../db/word.js';
import { nullableBy } from '../utilities/types.js';
import { SelectDecksByChapters } from '../db/deck.js';
import { SelectGradedDecksByChapters } from '../db/deckGraded.js';


const ChapterSchema = z.object({
    chapter_id: z.coerce.number(),
    chapter_title: z.string(),
    chapter_number: z.coerce.number(),
    book_id: z.coerce.number(),
    reader_id: z.uuidv7()
});


export async function getChapter(req: Request, res: Response) {
    try {
        const sessionID = await getCookie(req, "sessionID");
        if (!sessionID)
            return res.sendStatus(401);
        
        const output = ChapterSchema.pick({ chapter_id: true, reader_id: true }).safeParse({
            chapter_id: req.params.chapter_id,
            reader_id: await AuthorizeReaderBySession(sessionID)
        });

        if (!output.success) {
            console.error(output.error);
            return res.sendStatus(400);
        }

        const [chapter] = await SelectChapter(output.data.chapter_id, output.data.reader_id);
        if (!chapter)
            throw new Error('Select Failed');

        return res.status(200).json(chapter);
    }
    catch (error) {
        console.error("Error");
        if (process.env.ENV !== "production")
            console.error(error);
        return res.status(500);
    }
}



export async function getChapterWords(req: Request, res: Response) {
    try {
        const sessionID = await getCookie(req, "sessionID");
        if (!sessionID)
            return res.sendStatus(401);
        
        const output = ChapterSchema.pick({ chapter_id: true, reader_id: true }).safeParse({
            chapter_id: req.params.chapter_id,
            reader_id: await AuthorizeReaderBySession(sessionID)
        });

        if (!output.success) {
            console.error(output.error);
            return res.sendStatus(400);
        }

        const words = await SelectWordsFromChapter(output.data.chapter_id, output.data.reader_id);
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


export async function getChapterDecks(req: Request, res: Response) {
    try {
        const sessionID = await getCookie(req, "sessionID");
        if (!sessionID)
            return res.sendStatus(401);

        const output = ChapterSchema.pick({ chapter_id: true, reader_id: true }).safeParse({
            chapter_id: req.params.book_id,
            reader_id: await AuthorizeReaderBySession(sessionID)
        });

        if (!output.success) {
            console.error(output.error);
            return res.sendStatus(400);
        }
        
        const words = await SelectDecksByChapters([output.data.chapter_id], output.data.reader_id);
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


export async function getChapterGradedDecks(req: Request, res: Response) {
    try {
        const sessionID = await getCookie(req, "sessionID");
        if (!sessionID)
            return res.sendStatus(401);
        
        const output = ChapterSchema.pick({ chapter_id: true, reader_id: true }).safeParse({
            chapter_id: req.params.chapter_id,
            reader_id: await AuthorizeReaderBySession(sessionID)
        });

        if (!output.success) {
            console.error(output.error);
            return res.sendStatus(400);
        }

        const decks = await SelectGradedDecksByChapters([output.data.chapter_id], output.data.reader_id);
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


export async function getChapters(req: Request, res: Response) {
    try {
        const sessionID = await getCookie(req, "sessionID");
        if (!sessionID)
            return res.sendStatus(401);
        
        const output = ChapterSchema.pick({ reader_id: true }).safeParse({
            reader_id: await AuthorizeReaderBySession(sessionID)
        });

        if (!output.success) {
            console.error(output.error);
            return res.sendStatus(400);
        }

        const chapters = await SelectChapters(output.data.reader_id);
        if (!chapters)
            throw new Error('Create Failed');

        return res.status(200).json(chapters);
    }
    catch (error) {
        console.error("Error");
        if (process.env.ENV !== "production")
            console.error(error);
        return res.status(500);
    }
}


export async function createChapter(req: Request, res: Response) {
    try {
        const sessionID = await getCookie(req, "sessionID");
        if (!sessionID)
            return res.sendStatus(401);
        
        const output = ChapterSchema.omit({ chapter_id: true }).safeParse({
            book_id: req.body.book_id,
            chapter_title: req.body.chapter_title,
            chapter_number: req.body.chapter_number,
            reader_id: await AuthorizeReaderBySession(sessionID)
        });

        if (!output.success) {
            console.error(output.error);
            return res.sendStatus(400);
        }
        
        const [chapter] = await InsertChapter(output.data, output.data.reader_id);
        if (!chapter)
            throw new Error('Create Failed');

        return res.status(200).json(chapter);
    }
    catch (error) {
        console.error("Error");
        if (process.env.ENV !== "production")
            console.error(error);
        return res.status(500);
    }
}


export async function updateChapter(req: Request, res: Response) {
    try {
        const sessionID = await getCookie(req, "sessionID");
        if (!sessionID)
            return res.sendStatus(401);

        const output = nullableBy(ChapterSchema, ["chapter_title", "chapter_number"]).safeParse({
            book_id: req.body.book_id,
            chapter_id: req.body.chapter_id,
            chapter_title: req.body.chapter_title,
            chapter_number: req.body.chapter_number,
            reader_id: await AuthorizeReaderBySession(sessionID)
        });

        if (!output.success) {
            console.error(output.error);
            return res.sendStatus(400);
        }
        
        const [chapter] = await UpdateChapter(output.data, output.data.reader_id);
        if (!chapter)
            throw new Error('Update Failed');

        return res.status(200).json(chapter);
    }
    catch (error) {
        console.error("Error");
        if (process.env.ENV !== "production")
            console.error(error);
        return res.status(500);
    }
}


export async function deleteChapter(req: Request, res: Response) {
    try {
        const sessionID = await getCookie(req, "sessionID");
        if (!sessionID)
            return res.sendStatus(401);

        const output = ChapterSchema.pick({ chapter_id: true, reader_id: true}).safeParse({
            chapter_id: req.params.chapter_id,
            reader_id: await AuthorizeReaderBySession(sessionID)
        });

        if (!output.success) {
            console.error(output.error);
            return res.sendStatus(400);
        }

        const [deleted] = await DeleteChapter(output.data.chapter_id, output.data.reader_id);
        if (!deleted)
            throw new Error('Delete Failed');

        return res.status(200).json(deleted);
    }
    catch (error) {
        console.error("Error");
        if (process.env.ENV !== "production")
            console.error(error);
        return res.status(500);
    } 
}