import clsx from "clsx";
import { books } from "../books";
import Tilt from 'react-parallax-tilt';


interface MovingRowElementProps {
    selected: boolean;
    book: (typeof books[number] | null);
    onClickBook?: (book: typeof books[number]) => void;
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
                onClick={() => props.book && props.onClickBook && props.onClickBook(props.book)}
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
                        props.selected && "bg-black/0"
                    )}
                />
                <img
                    src={props.book?.background}
                    className="relative z-75 h-full"
                />
            </div>
        </Tilt>
    )
}