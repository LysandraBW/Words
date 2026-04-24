import z from "zod";

export interface Data {
    [k: string]: any
};

export type Field<V> = {
    value: V;
    test: z.ZodType;
    error: string;
    hasError: boolean;
};

export type Form<T extends Data> = {
    [K in keyof T]: Field<T[K]>;
}

export function createForm(fields: Array<{
    label: string,
    test: z.ZodType,
    value?: any,
}>) {
    const form = {};
    for (const field of fields) {
        (form as any)[field.label] = {
            value: field.value || "",
            test: field.test,
            error: "",
            isError: false,
        }
    }
    return form as any;
}

export function updateForm<D extends Data, K extends keyof D>(form: Form<D>, label: keyof D, value: D[K], test?: boolean): Form<D> {
    const field = {
        ...form[label],
        "value": value
    };

    if (test) {
        const output = field.test.safeParse(value);
        if (output.error) {
            field.hasError = true;
            field.error = output.error.message;
        }
    }

    return {
        ...form,
        [label]: field
    }
}

export function getFormData<D extends Data>(form: Form<D>): D {
    const object: Data = {};
    const labels: (keyof Form<D> & string)[] = Object.keys(form) as any;
    for (const label of labels) {
        object[label] = form[label].value;
    }
    return object as D;
}