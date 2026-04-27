"use client";
import { useEffect, useState } from "react"
import { BookType, createBook } from "@/services/db/book"
import InputDropdown, { Option } from "@/components/input/InputDropdown";
import { books_v1 } from "googleapis";
import searchBook from "@/services/books/searchBook";
import InputText from "@/components/input/InputText";
import InputTags from "@/components/input/InputTag/InputTags";
import Panel from "@/components/Panel";
import { createForm, Form, getFormData, updateFormValue } from "@/utilities/form";
import z from "zod";
import InputImageURL from "@/components/input/InputImageURL";
import Button from "@/components/Button";

interface CreateBookProps {
    onClose: () => void;
    onBookCreated: (book: BookType) => void;
}

export default function CreateBook(props: CreateBookProps) {
    const [books, setBooks] = useState<books_v1.Schema$Volume[]>([]);
    const [bookOptions, setBookOptions] = useState<Option[]>([]);
    const [selectedBookID, setSelectedBookID] = useState<string[]>();

    const [form, setForm] = useState<Form<BookType>>(createForm([
        {
            label: "book_name",
            test: z.string().min(1, "Must enter the name of a book.")
        },
        {
            label: "book_cover_image",
            test: z.url("Must enter a valid URL.")
        },
        {
            label: "book_background_image",
            test: z.url("Must enter a valid URL.")
        },
        {
            label: "book_year",
            test: z.coerce.number("Must enter a valid year.")
            .min(1000, "Must enter a year greater than 1000.")
            .max(3000, "Must enter a year less than 3000.")
        },
        {
            label: "book_author",
            test: z.array(z.string().min(1, "Authors must have a name."))
        }
    ]));
    

    useEffect(() => {
        if (!selectedBookID?.length)
            return;

        const book = books.find(b => b.id === selectedBookID[0]);

        let updatedForm = updateFormValue(form, "book_name", book?.volumeInfo?.title || "");
        updatedForm = updateFormValue(updatedForm, "book_cover_image", book?.volumeInfo?.imageLinks?.thumbnail || "");
        updatedForm = updateFormValue(updatedForm, "book_year", book?.volumeInfo?.publishedDate?.slice(0, 4) || "");
        updatedForm = updateFormValue(updatedForm, "book_author", book?.volumeInfo?.authors || "");
        setForm(updatedForm);

    }, [selectedBookID]);


    const updateBooks = async (search: string) => {
        const books: books_v1.Schema$Volume[] = await searchBook(search);
        setBooks(books);
        setBookOptions(books.filter(book => book.id).slice(0, 10).map(book => ({
            value: book.id || "",
            textLabel: book.volumeInfo?.title || "",
            optionLabel: (
                <div className="overflow-clip text-inherit">
                    <span className="block truncate text-inherit group-hover:text-blue-400 text-sm font-medium">
                        {book.volumeInfo?.title}
                    </span>
                    <span className="block text-xs text-zinc-400">
                        {book.volumeInfo?.publishedDate?.slice(0, 4) || "No Date Listed"}, {book.volumeInfo?.publisher || "No Publisher Listed"}
                    </span>
                </div>
            )
        })));
    }


    const onInsertAuthor = (value: string) => {
        const authors = new Set(form.book_author.value || []);
        authors.add(value);
        return [...authors];
    }


    const onDeleteAuthor = (value: string) => {
        const authors = new Set(form.book_author.value || []);
        authors.delete(value);
        return [...authors];
    }


    const onCreateBook = async (book: BookType) => {
        const createdBook = await createBook({
            book_id: -1,
            reader_id: '',
            book_name: book.book_name,
            book_year: book.book_year,
            book_author: book.book_author || null,
            book_background_image: book.book_background_image || null,
            book_cover_image: book.book_cover_image || null
        });
        
        if (createdBook)
            props.onBookCreated(createdBook[0]);
    }

    
    return (
        <Panel
            title="Create Book"
            onClose={props.onClose}
        >
            <div className="px-8 py-4 flex flex-col gap-y-4">
                <InputDropdown
                    toggleLabel="Search Books"
                    value={selectedBookID}
                    options={bookOptions}
                    onChange={(value) => setSelectedBookID([value])}
                    onSearchChange={updateBooks}
                    search={true}
                    searchPlaceholder="Search"
                />
                <InputText
                    label="Name"
                    value={form.book_name.value}
                    onChange={(value) => setForm(updateFormValue(form, "book_name", value))}
                    required={true}
                    error={form.book_name.error}
                />
                <InputText
                    label="Year Published"
                    value={form.book_year.value}
                    onChange={(value) => setForm(updateFormValue(form, "book_year", value))}
                    error={form.book_year.error}
                />
                <InputTags
                    label="Author"
                    value={form.book_author.value}
                    onDelete={(value) => setForm(updateFormValue(form, "book_author", onDeleteAuthor(value)))}
                    onInsert={(value) => setForm(updateFormValue(form, "book_author", onInsertAuthor(value)))}
                    error={form.book_author.error}
                />
                <InputImageURL
                    label="Cover Image"
                    value={form.book_cover_image.value || ""}
                    onChange={(value) => setForm(updateFormValue(form, "book_cover_image", value))}
                    error={form.book_cover_image.error}
            />
                <InputImageURL
                    label="Background Image"
                    value={form.book_background_image.value || ""}
                    onChange={(value) => setForm(updateFormValue(form, "book_background_image", value))}
                    error={form.book_background_image.error}
                />
                <Button
                    label="Create Book"
                    style="blue"
                    onClick={() => onCreateBook(getFormData(form))}
                />
            </div>
        </Panel>
    )
}