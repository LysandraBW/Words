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
    value?: any
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

export function updateFormValue<D extends Data, K extends keyof D>(form: Form<D>, label: keyof D, value: D[K], test?: boolean): Form<D> {
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

export function updateFormValues<D extends Data, K extends keyof D>(form: Form<D>, data: Partial<Pick<D, K>>, test?: boolean): Form<D> {
    const labels: K[] = Object.keys(data) as any;
    const updatedForm: Form<D> = {...form};

    for (const label of labels) {
        const field = {
            ...form[label],
            "value": data[label]
        };
        
        if (test) {
            const output = field.test.safeParse(data[label]);
            if (output.error) {
                field.hasError = true;
                field.error = output.error.message;
            }
        }
    }

    return updatedForm;
}

export function getFormData<D extends Data>(form: Form<D>): D {
    const data: Data = {};
    const labels: (keyof Form<D> & string)[] = Object.keys(form) as any;
    for (const label of labels) {
        data[label] = form[label].value;
    }
    return data as D;
}

export function resetForm<D extends Data>(form: Form<D>, defaultValues?: {[K in keyof D]: D[K]}): Form<D> {
    const updatedForm: Form<D> = {...form};
    const fields: (keyof D)[] = Object.keys(updatedForm);

    for (const field of fields) {
        updatedForm[field] = {
            ...updatedForm[field],
            value: defaultValues ? defaultValues[field] || "" : "",
            error: "",
            isError: false
        } as any
    }

    return updatedForm;
}

export function testForm<D extends Data>(form: Form<D>): boolean {
    let valid = true;

    for (const field of Object.values(form) as Field<any>[]) {
        const output = field.test.safeParse(field.value);
        valid = valid && output.error === undefined;
    }

    return valid;
}