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
            value: field.value ?? "",
            test: field.test,
            error: "",
            isError: false,
        }
    }
    return form as any;
}

export function updateFormValue<D extends Data, K extends keyof D>(form: Form<D>, label: keyof D, value: D[K], testValue: boolean = true): Form<D> {
    const field = {
        ...form[label],
        "value": value
    };

    if (testValue) {
        const output = field.test.safeParse(value);
        if (output.error) {
            field.hasError = true;
            field.error = JSON.parse(output.error.message)[0].message;
        }
        else {
            field.hasError = false;
            field.error = ""
        }
    }

    return {
        ...form,
        [label]: field
    }
}

export function updateFormTest<D extends Data, K extends keyof D>(form: Form<D>, label: keyof D, test: z.ZodType, testValue: boolean = true): Form<D> {
    const field = {
        ...form[label],
        "test": test
    };

    if (testValue) {
        const output = field.test.safeParse(field.value);
        if (output.error) {
            field.hasError = true;
            field.error = JSON.parse(output.error.message)[0].message;
        }
        else {
            field.hasError = false;
            field.error = ""
        }
    }

    return {
        ...form,
        [label]: field
    }
}

export function updateFormValues<D extends Data, K extends keyof D>(form: Form<D>, data: Partial<Pick<D, K>>, testValue: boolean = true): Form<D> {
    const labels: K[] = Object.keys(data) as any;
    let updatedForm: Form<D> = {...form};

    for (const label of labels) {
        const field = {
            ...form[label],
            "value": data[label]
        };
        
        if (testValue) {
            const output = field.test.safeParse(data[label]);
            if (output.error) {
                field.hasError = true;
                field.error = JSON.parse(output.error.message)[0].message;
            }
            else {
                field.hasError = false;
                field.error = ""
            }
        }

        updatedForm = {
            ...updatedForm,
            [label]: field
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

export function testForm<D extends Data>(form: Form<D>, setForm?: (form: Form<D>) => void): boolean {
    let valid = true;
    let updatedForm: Form<D> = {...form};
    const labels = Object.keys(form);
    
    for (const label of labels) {
        const field = {...form[label]};
    
        const output = field.test.safeParse(field.value);
        if (output.error) {
            console.log(output.error, field.value)
            valid = false;
            field.hasError = true;
            field.error = JSON.parse(output.error.message)[0].message;
        }
        else {
            field.hasError = false;
            field.error = ""
        }

        updatedForm = {
            ...updatedForm,
            [label]: field
        }
    }

    if (setForm)
        setForm(updatedForm);

    return valid;
}