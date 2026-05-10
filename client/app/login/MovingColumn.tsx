import clsx from "clsx";
import { books } from "./books";
import { useAnimate } from "framer-motion";
import { useEffect, useRef } from "react";

interface MovingColumnProps {
    books: (typeof books[number] | null)[];
    reverse: boolean;
    colIdx: number;
    numCols: number;
    onClickBook: (book: typeof books[number]) => void;
}

export default function MovingColumn(props: MovingColumnProps) {
    const [scope, animate] = useAnimate();
    const animationRef = useRef<any>(null);

    useEffect(() => {
        animationRef.current = animate(scope.current,
            { y: props.reverse ? ["-100%", "0%"] : ["0%", "-100%"] },
            { duration: 50, ease: "linear", repeat: Infinity }
        );
    }, []);

    return (
        <div
            style={{ '--colW': '7.5%' } as any}
            className="w-[var(--colW)] min-w-[var(--colW)] max-w-[var(--colW)] h-full"
            onMouseEnter={() => animationRef.current?.pause()}
            onMouseLeave={() => animationRef.current?.play()}
        >
            <div
                ref={scope}
                className="h-full flex flex-col gap-y-2 will-change-transform"
            >
                {[...props.books, ...props.books].map((book, i) => (
                    <div
                        key={i}
                        style={{ '--h': 'calc((100% - 48px) / 6)' } as any}
                        onClick={() => {
                            if (!book)
                                return;
                            props.onClickBook(book);
                        }}
                        className={clsx(
                            "w-full h-[var(--h)] min-h-[var(--h)] bg-cover bg-center rounded-xl hover:scale-105 transition-all",
                            book ? book.background : 'bg-neutral-200'
                        )}
                    />
                ))}
            </div>
        </div>
    );
}