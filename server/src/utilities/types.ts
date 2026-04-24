import z from "zod";

export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type NullableBy<T, K extends keyof T> = Omit<T, K> & { [P in K]?: T[P] | null | undefined };
export type NullableSchema<T extends z.ZodRawShape, K extends keyof T> = Omit<T, K> & { [P in K]: z.ZodNullable<T[P]> }

export function nullableBy<T extends z.ZodRawShape, K extends keyof T>(schema: z.ZodObject<T>, keys: K[]) {
    const nullableSchema = { ...schema.shape };
    for (const key of keys)
        nullableSchema[key] = (nullableSchema[key] as z.ZodType).nullable() as any;
    return z.object(nullableSchema as unknown as NullableSchema<T, K>);
}