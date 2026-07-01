import { Fragment } from "react/jsx-runtime";
import { Book, books, BookTitle } from "../books";
import MovingRow from "./MovingRow";
import { useCallback, useEffect, useRef, useState } from "react";


interface MovingBooksProps {
    state: string;
    onBookSelected: (book: Book) => void;
}


export default function MovingBooks(props: MovingBooksProps) {
    const rows = 2;
    const cols = 5;
    const [bookRows, setBookRows] = useState<(Book[][])>([]);

    const booksRef = useRef<{[k: string]: HTMLElement}|null>(null);
    const booksContainerRef = useRef<HTMLDivElement|null>(null);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    
    const [selectedBook, setSelectedBook] = useState<Book|null>(null);


    useEffect(() => {
        const bookRows: (Book)[][] = [...Array(rows)].map((e, i) => []);
        for (let i = 0; i < books.length; i++) {
            const rowIndex = i % rows;
            bookRows[rowIndex].push(books[i]);
        }
        setBookRows(bookRows);
    }, []);
    

    useEffect(() => {
        startInterval();
    }, [booksContainerRef.current, booksRef.current?.size]);


    useEffect(() => {
        if (!props.onBookSelected || !selectedBook)
            return;
        props.onBookSelected(selectedBook);
    }, [selectedBook?.title]);


    useEffect(() => {
        if (props.state === "STOP" && intervalRef.current) {
            clearInterval(intervalRef.current);
        }
        else if (props.state === "CONT") {
            if (intervalRef.current)
                clearInterval(intervalRef.current);

            // Select Book in 5s
            intervalRef.current = setInterval(() => {
                selectBook(booksContainerRef, booksRef);
            }, 5000);
        }
    }, [props.state]);


    const addBookReference = (bookTitle: string, bookElement: HTMLElement) => {
        if (!booksRef.current)
            booksRef.current = {};
        booksRef.current[bookTitle] = bookElement;
    }


    const selectBook = (booksContainerR: typeof booksContainerRef, booksR: typeof booksRef) => {
        if (!booksContainerR.current || !booksR.current)
            return;

        const boundingBox = booksContainerR.current.getBoundingClientRect();

        const pool: string[] = [];
        for (const [bookTitle, bookElement] of Object.entries(booksR.current) as [string, HTMLElement][]) {
            if (selectedBook?.title === bookTitle)
                continue;

            const bookBox = bookElement.getBoundingClientRect();
            
            const distanceFromL = bookBox.left - boundingBox.left;
            const distanceFromR = boundingBox.right - bookBox.right;

            const distanceFromLRatio = distanceFromL / boundingBox.width;
            const distanceFromRRatio = distanceFromR / boundingBox.width;
            
            if (distanceFromLRatio >= 0.1 && distanceFromRRatio >= 0)
                pool.push(bookTitle);
        }

        // Select Random from Pool
        const randomBookTitle = pool[Math.floor(Math.random() * pool.length)];
        const randomBook = books.find(book => book.title === randomBookTitle);
        if (!randomBook)
            return;

        setSelectedBook(randomBook);
    }


    const startInterval = () => {
        if (intervalRef.current)
            clearInterval(intervalRef.current);
        
        // Select Book
        selectBook(booksContainerRef, booksRef);

        // Select Book Every 5s
        intervalRef.current = setInterval(() => {
            selectBook(booksContainerRef, booksRef);
        }, 5000);
    }


    return (
        <div
            ref={booksContainerRef}
            className="relative w-full h-full flex flex-col gap-y-2 bg-neutral-900 overflow-clip"
        >
            {bookRows.map((booksInRow, i) => (
                <Fragment key={i}>
                    <MovingRow
                        rows={rows}
                        cols={cols}
                        books={booksInRow}
                        reverse={i % 2 === 0}
                        selectedBook={selectedBook}
                        onSelectBook={(book: Book) => {
                            if (intervalRef.current)
                                clearInterval(intervalRef.current)
                            
                            setSelectedBook(book);
                            props.onBookSelected(book);
                            intervalRef.current = setInterval(() => {
                                selectBook(booksContainerRef, booksRef);
                            }, 5000);
                        }}
                        addBookReference={addBookReference}
                    />
                </Fragment>
            ))}
        </div>
    )
}