import { BookType } from "@/services/server/book"
import Book from "./Book";
import { useRouter } from "next/navigation";
import { Fragment } from "react/jsx-runtime";
import clsx from "clsx";
import { gamjaFlower } from "../fonts";


interface ShowBooksProps {
    books: BookType[];
    onCreateBook: () => void;
}


export default function ShowBooks(props: ShowBooksProps) {
    const router = useRouter();


    return (
        <section className="w-full">
            <div className="p-4 flex flex-wrap gap-4">
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