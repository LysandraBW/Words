import { Book } from "../books";
import { useAnimate } from "framer-motion";
import { Fragment, useEffect, useRef } from "react";
import MovingRowElement from "./MovingRowElement";


interface MovingRowProps {
    rows: number;
    cols: number;
    reverse: boolean;
    books: Book[];
    selectedBook: Book | null;
    onSelectBook: (book: Book) => void;
    bookRefCallback: any;
}


export default function MovingRow(props: MovingRowProps) {
    const [scope, animate] = useAnimate();
    const animationRef = useRef<any>(null);

    const buckets = (props.books.length / props.cols);
    const distanceToTravel = `calc(-${buckets * 100}% - ${buckets * 8}px)`;
    

    useEffect(() => {
        animationRef.current = animate(scope.current,
            { x: false ? [distanceToTravel, "0%"] : ["0%", distanceToTravel] },
            { duration: 100, ease: "linear", repeat: Infinity }
        );
    }, []);


    return (
        <div
            style={{ '--colH': `calc((100% - ${8 * (props.rows - 1)}px) / ${props.rows})` } as any}
            className="h-[var(--colH)] min-h-[var(--colH)] max-h-[var(--colH)] w-full"
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
                style={{ '--w': `calc((100% - ${8 * (props.cols - 1)}px) / ${props.cols})` } as any}
                className="w-full h-full flex gap-x-2 will-change-transform"
            >
                {[...props.books, ...props.books].map((book, i) => (
                    <Fragment key={i}>
                        <MovingRowElement
                            book={book}
                            onClickBook={props.onSelectBook}
                            bookRefCallback={props.bookRefCallback}
                            isSelected={props.selectedBook === book}
                            isDuplicate={i >= props.books.length}
                        />
                    </Fragment>
                ))}
            </div>
        </div>
    )
}