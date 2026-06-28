import { Fragment } from "react/jsx-runtime";
import { books } from "../books";
import MovingRow from "./MovingRow";
import { useEffect, useState } from "react";


interface MovingBooksProps {
    selectedBook?: typeof books[number] | null;
    onSelectBook?: (book: typeof books[number]) => void;
}


export default function MovingBooks(props: MovingBooksProps) {
    const rows = 2;
    const [bookRows, setBookRows] = useState<(typeof books[number][][])>([]);

    useEffect(() => {
        const bookRows: (typeof books[number])[][] = [...Array(rows)].map((e, i) => []);
        for (const i in books) {
            const rowIndex = parseInt(i) % rows;
            bookRows[rowIndex].push(books[i]);
        }
        setBookRows(bookRows);
    }, []);


    return (
        <div 
            id="book-container"
            className="relative w-full h-full flex flex-col gap-y-2 bg-neutral-900 overflow-clip]"
        >
            {bookRows.map((e, i) => (
                <Fragment key={i}>
                    <MovingRow
                        rows={rows}
                        cols={5}
                        books={e}
                        reverse={i % 2 === 0}
                    />
                </Fragment>
            ))}
        </div>
    )
}