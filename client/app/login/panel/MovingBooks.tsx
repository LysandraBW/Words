import { Fragment } from "react/jsx-runtime";
import { Book, books } from "../books";
import { RefObject, useEffect, useRef, useState } from "react";
import MovingCol from "./MovingCol";


interface MovingBooksProps {
    intervalState: string;
    selectedBook: Book | null;
    onBookSelected: (book: Book) => void;
}


export default function MovingBooks(props: MovingBooksProps) {
    const rows = 2;
    const cols = 5;

    const [bookCols, setBookCols] = useState<(Book[][])>([]);

    const booksRef = useRef<{[k: string]: HTMLElement}>({});
    const carouselRef = useRef<HTMLDivElement|null>(null);

    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const intervalLength = 10000;


    useEffect(() => {
        const bookCols: (Book)[][] = [...Array(cols)].map((e, i) => []);

        for (let i = 0; i < books.length; i++) {
            const colIndex = i % cols;
            bookCols[colIndex].push(books[i]);
        }

        setBookCols(bookCols);
    }, []);
    

    useEffect(() => {
        startInterval();
    }, []);


    useEffect(() => {
        if (props.intervalState === "STOP" && intervalRef.current) {
            clearInterval(intervalRef.current);
        }
        else if (props.intervalState === "CONT") {
            if (intervalRef.current)
                clearInterval(intervalRef.current);
            
            intervalRef.current = setInterval(() => {
                randSelectBook(carouselRef, booksRef);
            }, intervalLength);
        }
    }, [props.intervalState]);


    const addBookReference = (bookTitle: string, bookElement: HTMLElement) => {
        booksRef.current[bookTitle] = bookElement;
    }


    const randSelectBook = (carouselRef: RefObject<HTMLDivElement|null>, booksRef: RefObject<{[k: string]: HTMLElement}>) => {
        if (!carouselRef.current || !booksRef.current)
            return;

        const pool: string[] = [];
        for (const [bookTitle, bookElement] of Object.entries(booksRef.current) as [string, HTMLElement][]) {
            if (props.selectedBook?.title === bookTitle)
                continue;
            pool.push(bookTitle);
        }

        // Select Random from Pool
        const randomBookTitle = pool[Math.floor(Math.random() * pool.length)];
        const randomBook = books.find(book => book.title === randomBookTitle);
        if (!randomBook)
            return;
        
        props.onBookSelected(randomBook);
    }


    const selectBook = (book: Book) => {
        props.onBookSelected(book);
        startInterval(true);
    }


    const startInterval = (wait: boolean = false) => {
        if (intervalRef.current)
            clearInterval(intervalRef.current);
        
        if (!wait)
            randSelectBook(carouselRef, booksRef);

        // Select Book Every 5s
        intervalRef.current = setInterval(() => {
            randSelectBook(carouselRef, booksRef);
        }, intervalLength);
    }


    return (
        <div
            ref={carouselRef}
            className="relative w-full h-full p-2 flex gap-2 bg-neutral-950 overflow-clip"
        >
            {bookCols.map((booksInCol, i) => (
                <Fragment key={i}>
                    <MovingCol
                        rows={rows}
                        cols={cols}
                        books={booksInCol}
                        selectedBook={props.selectedBook}
                        onSelectBook={selectBook}
                        addBookReference={addBookReference}
                    />
                </Fragment>
            ))}
        </div>
    )
}