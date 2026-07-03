import clsx from "clsx";
import { Book } from "../books";
import Tilt from 'react-parallax-tilt';
import { useEffect, useRef } from "react";


interface MovingRowElementProps {
    book: Book;
    addBookReference: (bookTitle: string, bookElement: HTMLElement) => void;
    isSelected: boolean;
    isDuplicate: boolean;
    onClickBook: (book: Book) => void;
}


export default function MovingRowElement(props: MovingRowElementProps) {
    const bookRef = useRef<HTMLDivElement|null>(null);


    useEffect(() => {
        if (props.isDuplicate || !bookRef.current)
            return;
        props.addBookReference(props.book.title, bookRef.current);
    }, [bookRef.current]);


    return (
        <Tilt 
            scale={1.05}
            glareEnable={true} 
            glareMaxOpacity={0.8}
            glareColor="#ffffff"
            glarePosition="bottom"
            glareBorderRadius="0.75rem"
            style={{"clipPath": "inset(0 0 0 0 1rem)"} as any}
            className="relative w-[var(--w)] min-w-[var(--w)] h-full border border-neutral-900 rounded-xl overflow-hidden hover:z-100 shadow-md"
        >
            <div
                ref={bookRef}
                data-title={!props.isDuplicate ? props.book?.title : ""}
                onClick={() => {
                    if (!props.book || !props.onClickBook)
                        return;
                    props.onClickBook(props.book);
                }}
                className={clsx(
                    "relative w-full h-full",
                    "flex justify-center items-center"
                )}
            >
                <div
                    className={clsx(
                        `absolute top-0 left-0 z-90 w-full h-full bg-black/75 hover:bg-black/0 transition-all`,
                        props.isSelected && "!bg-black/0"
                    )}
                />
                <img
                    src={props.book?.background}
                    loading="lazy"
                    className={clsx(
                        "relative z-75 h-full",
                        props.book?.title === "Heart of Darkness" && "w-full object-center object-cover"
                    )}
                />
            </div>
        </Tilt>
    )
}