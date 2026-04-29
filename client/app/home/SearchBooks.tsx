import InputDropdown from "@/components/input/InputDropdown";
import searchBooks, { GoogleBook } from "@/services/books/searchBooks";
import { CreateBookType } from "@/services/db/book";
import { useState } from "react";


interface SearchBooksProps {
    onClickBook: (book: CreateBookType) => void;
}


export default function SearchBooks(props: SearchBooksProps) {
    const [books, setBooks] = useState<GoogleBook[]>([]);
    const [selectedBookID, setSelectedBookID] = useState<string>();


    const onSearch = async (search: string) => {
        try {
            const searchedBooks: GoogleBook[] = await searchBooks(search);
            setBooks(searchedBooks);
        }
        catch (err) {
            alert((err as Error).message);
            setBooks([]);
        }
    }


    const onClickBook = async (bookID: string) => {
        const googleBook = books.find(b => b.id === bookID);
        if (!googleBook) {
            alert('Invalid Book');
            return;
        }
        setSelectedBookID(bookID);

        const {volumeInfo} = googleBook;
        const book = {
            'book_name': volumeInfo.title || '',
            'book_year': volumeInfo.publishedDate || '',
            'book_author': volumeInfo.authors || [],
            'book_cover_image': volumeInfo.imageLinks?.small || '',
            'book_background_image': volumeInfo.imageLinks?.large || '',
        }
        props.onClickBook(book);
    }


    return (
        <InputDropdown
            toggleLabel="Search Books"
            value={selectedBookID != null ? [selectedBookID] : []}
            options={books.map(book => ({
                value: book.id,
                textLabel: book.volumeInfo.title,
                optionLabel: (
                    <div className="overflow-clip text-inherit">
                        <span className="block truncate text-inherit group-hover:text-blue-400 text-sm font-medium">
                            {book.volumeInfo.title}
                        </span>
                        <span className="block text-xs text-zinc-400">
                            {book.volumeInfo.publishedDate || "No Date Listed"}, {book.volumeInfo.publisher || "No Publisher Listed"}
                        </span>
                    </div>
                )
            }))}
            onChange={(bookID) => onClickBook(bookID)}
            search={true}
            searchPlaceholder="Search"
            onSearchChange={onSearch}
        />
    )
}