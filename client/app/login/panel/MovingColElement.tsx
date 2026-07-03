import { Book } from "../books";
import Tilt from 'react-parallax-tilt';
import { useEffect, useRef } from "react";


interface MovingColElementProps {
    book: Book;
    addBookReference: (bookTitle: string, bookElement: HTMLElement) => void;
    isSelected: boolean;
    isDuplicate: boolean;
    onClickBook: (book: Book) => void;
}


export default function MovingColElement(props: MovingColElementProps) {
    const bookRef = useRef<HTMLDivElement|null>(null);


    useEffect(() => {
        if (props.isDuplicate || !bookRef.current)
            return;
        props.addBookReference(props.book.title, bookRef.current);
    }, [bookRef.current]);


    const onClick = () => {
        if (!props.book || !props.onClickBook)
            return;
        props.onClickBook(props.book);
    }


    return (
        <Tilt 
            scale={1.05}
            style={{
                "clipPath": "inset(0 0 0 0 1rem)",
                "contentVisibility": "auto",
                "containIntrinsicSize": "var(--colW) var(--h)"
            } as any}
            className="relative h-[var(--h)] min-h-[var(--h)] w-full border border-neutral-900 rounded-2xl shadow-md hover:z-100"
        >
            <div
                ref={bookRef}
                onClick={onClick}
                className="relative w-full h-full flex justify-center items-center"
            >
                <img
                    src={props.book?.background}
                    loading="lazy"
                    className="relative z-75 h-full"
                />
            </div>
        </Tilt>
    )
}