import clsx from "clsx";
import { Book } from "../books";
import Tilt from 'react-parallax-tilt';


interface MovingRowElementProps {
    book: Book;
    bookRefCallback: any;
    isSelected: boolean;
    isDuplicate: boolean;
    onClickBook: (book: Book) => void;
}


export default function MovingRowElement(props: MovingRowElementProps) {
    return (
        <Tilt 
            scale={1.05}
            glareEnable={true} 
            glareMaxOpacity={0.8}
            glareColor="#ffffff"
            glarePosition="bottom"
            glareBorderRadius="0.75rem"
            style={{"clipPath": "inset(0 0 0 0 1rem)"} as any}
            className="relative w-[var(--w)] min-w-[var(--w)] h-full overflow-hidden hover:z-100 book"
        >
            <div
                ref={props.bookRefCallback}
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
                    style={{ background: `url(${props.book?.background})` }} 
                    className={`absolute -top-1/2 -left-1/2 z-50 w-[200%] h-[200%] blur-lg`}
                />
                <div
                    className={clsx(
                        `absolute top-0 left-0 z-90 w-full h-full bg-black/50 hover:bg-black/0 transition-all`,
                        props.isSelected && "bg-black/0"
                    )}
                />
                <img
                    src={props.book?.background}
                    className={clsx(
                        "relative z-75 h-full",
                        props.book?.title === "Heart of Darkness" && "w-full object-center object-cover"
                    )}
                />
            </div>
        </Tilt>
    )
}