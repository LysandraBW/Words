import clsx from "clsx";
import { books } from "../../books";
import { distance, useAnimate } from "framer-motion";
import { Fragment, useEffect, useRef } from "react";
import MovingRowElement from "./MovingRowElement";


interface MovingRowProps {
    rows: number;
    cols: number;
    reverse: boolean;
    books: (typeof books[number] | null)[];
    selectedBook?: typeof books[number] | null;
    onSelectBook?: (book: typeof books[number]) => void;
}


export default function MovingRow(props: MovingRowProps) {
    const [scope, animate] = useAnimate();
    const animation = useRef<any>(null);

    const buckets = (props.books.length / props.cols);
    const distanceToTravel = `calc(-${buckets * 100}% - ${buckets * 8}px)`;
    

    useEffect(() => {
        animation.current = animate(scope.current,
            { x: false ? [distanceToTravel, "0%"] : ["0%", distanceToTravel] },
            { duration: 50, ease: "linear", repeat: Infinity }
        );
    }, []);


    return (
        <div
            style={{ '--colH': `calc((100% - ${8 * (props.rows - 1)}px) / ${props.rows})` } as any}
            className="h-[var(--colH)] min-h-[var(--colH)] max-h-[var(--colH)] w-full"
            onMouseEnter={() => animation.current?.pause()}
            onMouseLeave={() => animation.current?.play()}
        >
            <div
                ref={scope}
                style={{ '--w': `calc((100% - ${8 * (props.cols - 1)}px) / ${props.cols})` } as any}
                className="w-full h-full flex gap-x-2 will-change-transform"
            >
                {[...props.books, ...props.books].map((book, i) => (
                    <Fragment key={i}>
                        <MovingRowElement
                            selected={props.selectedBook === book}
                            book={book}
                            onClickBook={props.onSelectBook}
                        />
                    </Fragment>
                ))}
            </div>
        </div>
    )
}