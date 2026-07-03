import { Book } from "../books";
import { useAnimate } from "framer-motion";
import { Fragment, useEffect, useRef } from "react";
import MovingRowElement from "./MovingRowElement";
import MovingColElement from "./MovingColElement";


interface MovingColProps {
    rows: number;
    cols: number;
    reverse: boolean;
    books: Book[];
    selectedBookRef: Book | null;
    onSelectBook: (book: Book) => void;
    addBookReference: (bookTitle: string, bookElement: HTMLElement) => void;
}


export default function MovingCol(props: MovingColProps) {
    const [scope, animate] = useAnimate();
    const animationRef = useRef<any>(null);

    const buckets = (props.books.length / props.rows);
    const distanceToTravel = `calc(-${buckets * 100}% - ${buckets * 8}px)`;
    

    useEffect(() => {
        animationRef.current = animate(scope.current,
            { y: false ? [distanceToTravel, "0%"] : ["0%", distanceToTravel] },
            { duration: 150, ease: "linear", repeat: Infinity }
        );
    }, []);


    return (
        <div
            style={{ '--colW': `calc((100% - ${8 * (props.cols - 1)}px) / ${props.cols})` } as any}
            className="w-[var(--colW)] min-w-[var(--colW)] max-w-[var(--colW)] h-full"
            onMouseEnter={() => {
                if (!animationRef.current)
                    return;
                animationRef.current.speed = 0.5;
            }}
            onMouseLeave={() => {
                 if (!animationRef.current)
                    return;
                animationRef.current.speed = 1;
            }}
        >
            <div
                ref={scope}
                style={{ 
                    '--h': `calc((100% - ${8 * (props.rows - 1)}px) / ${props.rows})`
                } as any}
                className="w-full h-full flex flex-col gap-y-2 will-change-transform"
            >
                {[...props.books, ...props.books].map((book, i) => (
                    <Fragment key={i}>
                        <MovingColElement
                            book={book}
                            onClickBook={props.onSelectBook}
                            addBookReference={props.addBookReference}
                            isSelected={props.selectedBookRef === book}
                            isDuplicate={i >= props.books.length}
                        />
                    </Fragment>
                ))}
            </div>
        </div>
    )
}