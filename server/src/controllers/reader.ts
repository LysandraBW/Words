import { type Request, type Response } from 'express';
import z from 'zod';
import { delCookie, getCookie, setCookie } from '../utilities/cookie.js';
import { AuthorizeReaderBySession, DeleteReader, SelectReader, SignInReader, SignUpReader, UpdateReader } from '../db/reader.js';
import { nullableBy } from '../utilities/types.js';


const ReaderSchema = z.object({
    reader_id: z.uuidv7(),
    reader_name: z.string(),
    reader_email: z.email(),
    reader_password: z.string(),
    reader_profile_image: z.url()
});


export async function getReader(req: Request, res: Response) {
    const sessionID = await getCookie(req, "sessionID");
    if (!sessionID)
        return res.sendStatus(401);

    const output = ReaderSchema.pick({ reader_id: true }).safeParse({
        reader_id: await AuthorizeReaderBySession(sessionID)
    });

    if (!output.success) {
        console.error(output.error);
        return res.sendStatus(400);
    }

    const reader = await SelectReader(output.data.reader_id);
    res.status(200).json(reader);
}



export async function signIn(req: Request, res: Response) {
    const output = ReaderSchema.pick({ reader_email: true, reader_password: true }).safeParse({
        reader_email: req.body.reader_email,
        reader_password: req.body.reader_password
    });

    if (!output.success) {
        console.error(output.error);
        return res.sendStatus(400);
    }

    const sessionID = await SignInReader(output.data);
    if (!sessionID)
        return res.sendStatus(401);

    await setCookie(res, "sessionID", sessionID);
    res.sendStatus(200);
}



export async function signUp(req: Request, res: Response) {
    const output = ReaderSchema.pick({ reader_name: true, reader_email: true, reader_password: true }).safeParse({
        reader_name: req.body.reader_name,
        reader_email: req.body.reader_email,
        reader_password: req.body.reader_password
    });

    if (!output.success) {
        console.error(output.error);
        return res.sendStatus(400);
    }

    const sessionID = await SignUpReader(output.data);
    if (!sessionID)
        return res.sendStatus(400);

    setCookie(res, "sessionID", sessionID);
    res.sendStatus(200);
}



export async function signOut(req: Request, res: Response) {
    const sessionID = await getCookie(req, "sessionID");
    if (!sessionID)
        return res.sendStatus(401);

    delCookie(res, "sessionID");
    res.sendStatus(200);
}



export async function updateReader(req: Request, res: Response) {
    const sessionID = await getCookie(req, "sessionID");
    if (!sessionID)
        return res.sendStatus(401);

    const output = nullableBy(ReaderSchema, ["reader_name", "reader_email", "reader_password", "reader_profile_image"]).safeParse({
        reader_name: req.body.reader_name,
        reader_email: req.body.reader_email,
        reader_password: req.body.reader_password,
        reader_profile_image: req.body.reader_profile_image,
        reader_id: await AuthorizeReaderBySession(sessionID)
    });

    if (!output.success) {
        console.error(output.error);
        return res.sendStatus(400);
    }
    
    const readers = await UpdateReader(output.data);
    return res.status(200).json(readers);
}



export async function deleteReader(req: Request, res: Response) {
    const sessionID = await getCookie(req, "sessionID");
    if (!sessionID)
        return res.sendStatus(401);

    const output = ReaderSchema.pick({ reader_id: true}).safeParse({
        reader_id: await AuthorizeReaderBySession(sessionID)
    });

    if (!output.success) {
        console.error(output.error);
        return res.sendStatus(400);
    }

    delCookie(res, "sessionID");
    await DeleteReader(output.data.reader_id);
    return res.status(200);
}