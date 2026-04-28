import 'dotenv/config';
import db from "./db.js";
import type { NullableBy } from '../utilities/types.js';


export interface Reader {
    reader_id: string;
    reader_name: string;
    reader_email: string;
    reader_password: string;
    reader_profile_image: string;
}


export async function AuthorizeReaderBySession(sessionID: string): Promise<string> {
    try {
        const [row] = await db`
            SELECT  reader_id
            FROM    reader_session 
            WHERE   session_id = ${sessionID} AND 
                    NOW() - creation_date < INTERVAL '90 days'
            LIMIT   1;
        `;
        if (row)
            return row.reader_id;
        return "";
    }
    catch (error) {
        console.log("Error Authenticating Reader");
        if (process.env.ENV !== "production")
            console.error(error);
        return "";
    }
}


export async function AuthenticateReaderByLogin(reader: Pick<Reader, "reader_email" | "reader_password">): Promise<string> {
    try {
        const [row] = await db`
            SELECT  reader_id 
            FROM    Reader 
            WHERE   reader_email = ${reader.reader_email} AND
                    reader_password = crypt(${reader.reader_password}, gen_salt(\'bf\'))
            LIMIT   1;
        `;
        if (row)
            return row.reader_id;
        return "";
    }
    catch (error) {
        console.log("Error Authenticating Reader");
        if (process.env.ENV !== "production")
            console.error(error);
        return "";
    }
}


export async function InsertSession(readerID: string): Promise<string> {
    try {
        const [row] = await db`
            INSERT INTO reader_session (reader_id)
            VALUES (${readerID})
            ON CONFLICT (reader_id) DO UPDATE
            SET reader_id = EXCLUDED.reader_id
            RETURNING *
        `;
        return row?.session_id;
    }
    catch (error) {
        console.error("Error Inserting Session");
        if (process.env.ENV !== "production")
            console.error(error);
        return "";
    }
}


export async function SelectReader(readerID: string) {
    try {
        const rows = await db<Reader[]>`
            SELECT  * 
            FROM    Reader 
            WHERE   reader_id = ${readerID}
            LIMIT   1;
        `;

        if (!rows || rows.length !== 1)
            throw 'Select Failed';

        return rows[0];
    }
    catch (error) {
        console.log("Error Authenticating Reader");
        if (process.env.ENV !== "production")
            console.error(error);
        return null;
    }
}


export async function InsertReader(reader: Pick<Reader, "reader_name" | "reader_email" | "reader_password">) {
    try {
        return await db.begin(async (db: any) => {
            const rows = await db<Reader[]>`
                INSERT INTO Reader (
                    reader_name, 
                    reader_email, 
                    reader_password
                )
                VALUES (
                    ${reader.reader_name},
                    ${reader.reader_email},
                    crypt(${reader.reader_password}, gen_salt(\'bf\'))
                ) 
                RETURNING   *
            `;

            if (!rows || rows.length !== 1)
                throw 'Insert Failed';

            return rows[0];
        });
    }
    catch (error) {
        console.log("Error Inserting Reader");
        if (process.env.ENV !== "production")
            console.error(error);
        return null;
    }
}


export async function UpdateReader(reader: NullableBy<Reader, "reader_name" | "reader_email" | "reader_password" | "reader_profile_image">) {
    try {
        return await db.begin(async (db: any) => {
            const rows = await db<Reader[]>`
                UPDATE  Reader
                SET     reader_name = COALESCE(${reader.reader_name ?? null}, reader_name),
                        reader_email = COALESCE(${reader.reader_email ?? null}, reader_email),
                        reader_password = COALESCE(${reader.reader_password ?? null}, reader_password),
                        reader_profile_image = COALESCE(${reader.reader_profile_image ?? null}, reader_profile_image)
                WHERE   reader_id = ${reader.reader_id}
                RETURNING *
            `;

            if (!rows || rows.length !== 1)
                throw 'Update Failed';

            return rows[0];
        });
    }
    catch (error) {
        console.error("Error Updating Reader");
        if (process.env.ENV !== "production")
            console.error(error);
        return null;
    }
}


export async function DeleteReader(readerID: string) {
    try {
        return await db.begin(async (db: any) => {
            const rows = await db`
                DELETE FROM Reader
                WHERE reader_id = ${readerID}
            `;

            if (!rows || rows.length !== 1)
                throw 'Delete Failed';

            return rows[0];
        });
    }
    catch (error) {
        console.error("Error Deleting Reader");
        if (process.env.ENV !== "production")
            console.error(error);
        return null;
    }
}


export async function SignUpReader(reader: Pick<Reader, "reader_name" | "reader_email" | "reader_password">) {
    const insertedReader = await InsertReader(reader);
    
    if (!insertedReader)
        return "";
    
    const insertedReaderID = insertedReader[0]?.reader_id;
    if (insertedReaderID)
        return await InsertSession(insertedReaderID);
    
    console.error("Error Signing Up Reader");
    return "";
}


export async function SignInReader(reader: Pick<Reader, "reader_email" | "reader_password">) {
    try {
        const [row] = await db`
            SELECT  reader_id 
            FROM    Reader 
            WHERE   reader_email = ${reader.reader_email} AND
                    reader_password = crypt(${reader.reader_password}, reader_password)
        `;
        if (row)
            return await InsertSession(row.reader_id);
        return "";
    }
    catch (error) {
        console.error("Error Signing in Reader");
        if (process.env.ENV !== "production")
            console.error(error);
        return "";
    }
}