import clsx from "clsx";
import { books } from "../login/books";
import { useAnimate } from "framer-motion";
import { Fragment, useEffect, useRef } from "react";
import MovingRowElement from "./MovingRowElement";


interface MovingRowProps {
    selectedBook: typeof books[number] | null;
    books: (typeof books[number] | null)[];
    reverse: boolean;
    onClickBook: (book: typeof books[number]) => void;
}


export default function MovingRow(props: MovingRowProps) {
    const [scope, animate] = useAnimate();
    const animation = useRef<any>(null);
    

    useEffect(() => {
        animation.current = animate(scope.current,
            { x: props.reverse ? ["calc(-100% - 8px)", "0%"] : ["0%", "calc(-100% - 8px)"] },
            { duration: 50, ease: "linear", repeat: Infinity }
        );
    }, []);


    return (
        <div
            style={{ '--colH': 'calc((100% - 40px) / 6)' } as any}
            className="h-[var(--colH)] min-h-[var(--colH)] max-h-[var(--colH)] w-full"
            onMouseEnter={() => animation.current?.pause()}
            onMouseLeave={() => animation.current?.play()}
        >
            <div
                ref={scope}
                style={{ '--w': `calc((100% - 88px) / ${props.books.length})` } as any}
                className="w-full h-full flex gap-x-2 will-change-transform"
            >
                {[...props.books, ...props.books].map((book, i) => (
                    <Fragment key={i}>
                        <MovingRowElement
                            selected={props.selectedBook === book}
                            book={book}
                            onClickBook={props.onClickBook}
                        />
                    </Fragment>
                ))}
            </div>
        </div>
    )
}