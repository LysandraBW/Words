import { BookType } from "@/services/server/book"
import Book from "./Book";
import { useRouter } from "next/navigation";
import { Fragment } from "react/jsx-runtime";


interface ShowBooksProps {
    books: BookType[];
    onCreateBook: () => void;
}


export default function ShowBooks(props: ShowBooksProps) {
    const router = useRouter();


    return (
        <section className="w-full px-4 py-4">
            <h3 className="mb-4 text-lg text-white font-medium tracking-tight">
                Books
            </h3>
            <div className="flex flex-wrap gap-8">
                <Book
                    isCreate={true}
                    onClick={props.onCreateBook}
                />
                {props.books.map(book => (
                    <Fragment key={book.book_id}>
                        <Book
                            book={book}
                            onClick={() => router.push(`/book?bookID=${book.book_id}`)}
                        />
                    </Fragment>
                ))}
            </div>
        </section>
    )
}