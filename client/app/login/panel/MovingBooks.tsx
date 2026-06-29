import { Fragment } from "react/jsx-runtime";
import { Book, books, BookTitle } from "../books";
import MovingRow from "./MovingRow";
import { useCallback, useEffect, useRef, useState } from "react";


interface MovingBooksProps {
    onBookSelected: (book: Book) => void;
}


export default function MovingBooks(props: MovingBooksProps) {
    const rows = 2;
    const cols = 5;
    const [bookRows, setBookRows] = useState<(Book[][])>([]);

    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const containerRef = useRef(null);
    const intersectionObserverRef = useRef<IntersectionObserver>(null);

    const [selectedBook, setSelectedBook] = useState<Book|null>(null);
    const [visibleBooks, setVisibleBooks] = useState<Set<BookTitle>>(new Set());


    const bookRefCallback = useCallback((book: Element) => {
        if (!intersectionObserverRef.current || !book)
            return;
        intersectionObserverRef.current.observe(book);
    }, []);


    useEffect(() => {
        const bookRows: (Book)[][] = [...Array(rows)].map((e, i) => []);
        for (let i = 0; i < books.length; i++) {
            const rowIndex = i % rows;
            bookRows[rowIndex].push(books[i]);
        }
        setBookRows(bookRows);
    }, []);
    

    useEffect(() => {
        if ((!visibleBooks.size || intervalRef.current) && (visibleBooks.has(selectedBook?.title || "")))
            return;

        console.log('Start', visibleBooks);
        startBookCycle(visibleBooks);
    }, [visibleBooks]);


    useEffect(() => {
        if (!containerRef.current)
            return;
        
        intersectionObserverRef.current = new IntersectionObserver((entries) => {
            setVisibleBooks((visibleBooks: Set<string>) => {
                const updatedVisibleBooks = new Set<string>(visibleBooks);
                for (const entry of entries) {
                    const title = entry.target.getAttribute("data-title");
                    if (!title)
                        continue;

                    if (entry.isIntersecting) {
                        updatedVisibleBooks.add(title);
                    }
                    else {
                        updatedVisibleBooks.delete(title);
                    }
                }
                return updatedVisibleBooks;
            })
        }, {
            root: containerRef.current,
            threshold: 1
        });

        return () => {
            if (intersectionObserverRef.current)
                intersectionObserverRef.current.disconnect();
        }
    }, []);


    useEffect(() => {
        // console.log(selectedBook?.title);
        if (!selectedBook || !props.onBookSelected)
            return;
        props.onBookSelected(selectedBook);
    }, [selectedBook?.title]);


    const startBookCycle = (visibleBooks: Set<string>) => {
        if (intervalRef.current)
            clearInterval(intervalRef.current);
        
        selectBook(visibleBooks);
        intervalRef.current = setInterval(() => {
            selectBook(visibleBooks);
        }, 5000);
    }

    const selectBook = (visibleBooks: Set<string>) => {
        console.log(2, visibleBooks)
        const bookTitles = [...visibleBooks];
        const nextBookTitle = bookTitles[Math.floor(Math.random() * bookTitles.length)];
        const nextBook = books.find(book => book.title === nextBookTitle) || null;
        
        console.log(nextBookTitle)
        setSelectedBook(nextBook);
    }

    return (
        <div
            ref={containerRef}
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
                        onSelectBook={props.onBookSelected}
                        bookRefCallback={bookRefCallback}
                    />
                </Fragment>
            ))}
        </div>
    )
}