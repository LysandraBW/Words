import { type Request, type Response } from 'express';
import z from 'zod';
import { getCookie } from '../utilities/cookie.js';
import { AuthorizeReaderBySession } from '../db/reader.js';
import { DecrementWordNumberInstances, DeleteWord, IncrementWordNumberInstances, InsertWord, SelectWord, SelectWords, SelectWordsFromBook, SelectWordsFromChapter } from '../db/word.js';

const wordSchema = z.object({
    word_id: z.coerce.number(),
    chapter_id: z.coerce.number(),
    word: z.tuple([z.string(), z.string()]),
    word_number_instances: z.coerce.number(),
    reader_id: z.uuidv7(),
});



export async function getWord(req: Request, res: Response) {
    const sessionID = await getCookie(req, "sessionID");
    if (!sessionID)
        return res.sendStatus(401);

    const output = wordSchema.pick({ word_id: true, reader_id: true }).safeParse({
        word_id: req.params.word_id,
        reader_id: await AuthorizeReaderBySession(sessionID)
    });

    if (!output.success) {
        console.error(output.error);
        return res.sendStatus(400);
    }

    const word = await SelectWord(output.data.word_id, output.data.reader_id);
    return res.status(200).json(word);
}



export async function getWords(req: Request, res: Response) {
    const sessionID = await getCookie(req, "sessionID");
    if (!sessionID)
        return res.sendStatus(401);

    const output = wordSchema.pick({ reader_id: true }).safeParse({
        reader_id: await AuthorizeReaderBySession(sessionID)
    });

    if (!output.success) {
        console.error(output.error);
        return res.sendStatus(400);
    }

    const word = await SelectWords(output.data.reader_id);
    return res.status(200).json(word);
}



export async function createWord(req: Request, res: Response) {
    const sessionID = await getCookie(req, "sessionID");
    if (!sessionID)
        return res.sendStatus(401);

    const output = wordSchema.omit({ word_id: true, word_number_instances: true }).safeParse({
        word: req.body.word,
        chapter_id: req.body.chapter_id,
        reader_id: await AuthorizeReaderBySession(sessionID)
    });

    if (!output.success) {
        console.error(output.error);
        return res.sendStatus(400);
    }
    
    const word = await InsertWord(output.data, output.data.reader_id);
    return res.status(200).json(word);
}



export async function deleteWord(req: Request, res: Response) {
    const sessionID = await getCookie(req, "sessionID");
    if (!sessionID)
        return res.sendStatus(401);

    const output = wordSchema.pick({ word_id: true, reader_id: true}).safeParse({
        word_id: req.params.word_id,
        reader_id: await AuthorizeReaderBySession(sessionID)
    });

    if (!output.success) {
        console.error(output.error);
        return res.sendStatus(400);
    }

    const deleted = await DeleteWord(output.data.word_id, output.data.reader_id);
    return res.status(200).json(deleted);
}



export async function incrementNumberInstances(req: Request, res: Response) {
    const sessionID = await getCookie(req, "sessionID");
    if (!sessionID)
        return res.sendStatus(401);

    const output = wordSchema.pick({ word_id: true, reader_id: true}).safeParse({
        word_id: req.params.word_id,
        reader_id: await AuthorizeReaderBySession(sessionID)
    });

    if (!output.success) {
        console.error(output.error);
        return res.sendStatus(400);
    }

    const rows = await IncrementWordNumberInstances(output.data.word_id, output.data.reader_id);
    return res.status(200).json(rows);
}



export async function decrementNumberInstances(req: Request, res: Response) {
    const sessionID = await getCookie(req, "sessionID");
    if (!sessionID)
        return res.sendStatus(401);

    const output = wordSchema.pick({ word_id: true, reader_id: true}).safeParse({
        word_id: req.params.word_id,
        reader_id: await AuthorizeReaderBySession(sessionID)
    });

    if (!output.success) {
        console.error(output.error);
        return res.sendStatus(400);
    }

    const rows = await DecrementWordNumberInstances(output.data.word_id, output.data.reader_id);
    return res.status(200).json(rows);
}