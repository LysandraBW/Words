import InputDropdown from "@/components/input/InputDropdown";
import searchBooks, { GoogleBook } from "@/services/books/searchBooks";
import { CreateBookType } from "@/services/server/book";
import { useState } from "react";


interface SearchBooksProps {
    onClickBook: (book: CreateBookType) => void;
}


export default function SearchBooks(props: SearchBooksProps) {
    const [books, setBooks] = useState<GoogleBook[]>([]);
    const [selectedBook, setSelectedBook] = useState<string>();


    const onSearch = async (search: string) => {
        try {
            const books = await searchBooks(search);
            setBooks(books);
        }
        catch (err) {
            alert(err);
            setBooks([]);
        }
    }


    const onSelectBook = async (bookID: string) => {
        const googleBook = books.find(b => b.id === bookID);
        if (!googleBook) {
            alert('Invalid Book');
            return;
        }

        // Update Book
        setSelectedBook(bookID);

        // Update Form
        const {volumeInfo} = googleBook;
        props.onClickBook({
            'book_cover_image': volumeInfo.imageLinks?.small || '',
            'book_background_image': volumeInfo.imageLinks?.large || '',
            'book_name': volumeInfo.title || '',
            'book_year': volumeInfo.publishedDate || '',
            'book_author': volumeInfo.authors || [],
        });
    }


    return (
        <InputDropdown
            toggleLabel="Search Books"
            value={selectedBook != null ? [selectedBook] : []}
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
            onChange={(bookID) => onSelectBook(bookID)}
            search={true}
            searchPlaceholder="Search"
            onSearchChange={onSearch}
        />
    )
}