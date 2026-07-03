import { Fragment } from "react/jsx-runtime";
import { Book, books, BookTitle } from "../books";
import MovingRow from "./MovingRow";
import { useCallback, useEffect, useRef, useState } from "react";
import MovingCol from "./MovingCol";


interface MovingBooksProps {
    state: string;
    onBookSelected: (book: Book) => void;
}


export default function MovingBooks(props: MovingBooksProps) {
    const rows = 2;
    const cols = 5;
    const [bookRows, setBookRows] = useState<(Book[][])>([]);
    const [bookCols, setBookCols] = useState<(Book[][])>([]);

    const booksRef = useRef<{[k: string]: HTMLElement}|null>(null);
    const booksContainerRef = useRef<HTMLDivElement|null>(null);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const interval = 1000;

    const selectedBookRef = useRef<Book|null>(null);


    useEffect(() => {
        const bookRows: (Book)[][] = [...Array(rows)].map((e, i) => []);
        const bookCols: (Book)[][] = [...Array(cols)].map((e, i) => []);

        for (let i = 0; i < books.length; i++) {
            const rowIndex = i % rows;
            bookRows[rowIndex].push(books[i]);

            const colIndex = i % cols;
            bookCols[colIndex].push(books[i]);
        }

        // I don't feel like explaining this, but I don't like that
        // the middle card blocks the books in the middle, so I'm repeating
        // the images in other rows/columns so that they all have a fair chance of being seen.
        const bookRowsCopy = bookRows.map((e, i) => [...e]);
        for (let i = 0; i < bookRows.length; i++) {
            let j = i + 1;
            while (j !== i) {
                if (j >= bookRows.length) {
                    j = 0;
                    continue;
                }
                bookRows[i] = [...bookRowsCopy[i], ...bookRowsCopy[j]];
                j += 1;
            }
        }

        const bookColsCopy = bookCols.map((e, i) => [...e]);
        for (let i = 0; i < bookCols.length; i++) {
            let j = i + 1;
            while (j !== i) {
                if (j >= bookCols.length) {
                    j = 0;
                    continue;
                }
                bookCols[i] = [...bookColsCopy[i], ...bookColsCopy[j]];
                j += 1;
            }
        }

        setBookRows(bookRows);
        setBookCols(bookCols);
    }, []);
    

    useEffect(() => {
        startInterval();
    }, [booksContainerRef.current, booksRef.current?.size]);


    useEffect(() => {
        console.log('C')
        if (!props.onBookSelected || !selectedBookRef.current)
            return;
        console.log(1)
        props.onBookSelected(selectedBookRef.current);
    }, [selectedBookRef.current]);


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
            }, interval);
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

        console.log('A')
        const boundingBox = booksContainerR.current.getBoundingClientRect();
        // console.log(boundingBox)

        const pool: string[] = [];
        for (const [bookTitle, bookElement] of Object.entries(booksR.current) as [string, HTMLElement][]) {
            if (selectedBookRef.current?.title === bookTitle)
                continue;

            const bookBox = bookElement.getBoundingClientRect();
            // console.log(bookElement, bookBox);
            
            const distanceFromL = bookBox.left - boundingBox.left;
            const distanceFromR = boundingBox.right - bookBox.right;

            const distanceFromLRatio = distanceFromL / boundingBox.width;
            const distanceFromRRatio = distanceFromR / boundingBox.width;

            // const distanceFromT = bookBox.top - boundingBox.top;
            // const distanceFromB = boundingBox.bottom - bookBox.bottom;

            // const distanceFromTRatio = distanceFromT / boundingBox.height;
            // const distanceFromBRatio = distanceFromB / boundingBox.height;
            
            // console.log(distanceFromTRatio, distanceFromBRatio);
            if (distanceFromLRatio >= 0.1 && distanceFromRRatio >= 0)
                pool.push(bookTitle);

            // if (distanceFromTRatio >= 0 && distanceFromBRatio >= 0)
            //     pool.push(bookTitle);
        }

        // console.log(pool)

        // Select Random from Pool
        const randomBookTitle = pool[Math.floor(Math.random() * pool.length)];
        const randomBook = books.find(book => book.title === randomBookTitle);
        if (!randomBook)
            return;

        console.log('B')
        selectedBookRef.current = randomBook;
    }


    const startInterval = () => {
        if (intervalRef.current)
            clearInterval(intervalRef.current);
        
        // Select Book
        selectBook(booksContainerRef, booksRef);

        // Select Book Every 5s
        intervalRef.current = setInterval(() => {
            selectBook(booksContainerRef, booksRef);
        }, interval);

        
    }


    return (
        <div
            ref={booksContainerRef}
            className="relative w-full h-full p-2 flex flex-col- gap-2 bg-neutral-950 overflow-clip"
        >
            {/* {bookRows.map((booksInRow, i) => (
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
                            }, interval);
                        }}
                        addBookReference={addBookReference}
                    />
                </Fragment>
            ))} */}
            {bookCols.map((booksInCol, i) => (
                <Fragment key={i}>
                    <MovingCol
                        rows={rows}
                        cols={cols}
                        books={booksInCol}
                        reverse={i % 2 === 0}
                        selectedBookRef={selectedBookRef.current}
                        onSelectBook={(book: Book) => {
                            if (intervalRef.current)
                                clearInterval(intervalRef.current)
                            
                            selectedBookRef.current = book;
                            props.onBookSelected(book);
                            intervalRef.current = setInterval(() => {
                                selectBook(booksContainerRef, booksRef);
                            }, interval);
                        }}
                        addBookReference={addBookReference}
                    />
                </Fragment>
            ))}
        </div>
    )
}