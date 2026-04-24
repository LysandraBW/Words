import 'dotenv/config';
import jwt from "jsonwebtoken";
import { type Request, type Response } from "express";

export const getCookie = async (
    req: Request,
    name: string
): Promise<string|null> => {
    const data = req.cookies[name];
    if (!data)
        return null;
    const decryptedData = jwt.verify(data, process.env.ATS || "") || "";
    return <string> decryptedData;
}

export const setCookie = async (
    res: Response, 
    name: string,
    data: string
): Promise<void> => {
    const token = jwt.sign(data, process.env.ATS || '');
    res.cookie(name, token, {maxAge: 9000000, httpOnly: false, secure: false, sameSite: "lax", path: "/"});
}

export const delCookie = async (
    res: Response,
    name: string
): Promise<void> => {
    res.clearCookie(name, {maxAge: 9000000, httpOnly: false, secure: false, sameSite: "lax", path: "/"});
}