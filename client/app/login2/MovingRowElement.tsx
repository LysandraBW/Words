import clsx from "clsx";
import { books } from "../login/books";
import Tilt from 'react-parallax-tilt';


interface MovingRowElementProps {
    selected: boolean;
    book: (typeof books[number] | null);
    onClickBook: (book: typeof books[number]) => void;
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
            className={clsx(
                "w-[var(--w)] min-w-[var(--w)] h-full",
                "bg-cover bg-center rounded-xl",
                "cursor-pointer group"
            )}
        >
            <div
                onClick={() => {
                    if (!props.book)
                        return;
                    props.onClickBook(props.book);
                }}
                className={clsx(
                    "relative w-full h-full bg-center bg-cover bg-neutral-200 rounded-xl",
                    "saturate-0 group-hover:saturate-100 transition-all",
                    props.book && props.book.background,
                    props.selected && "!saturate-100"
                )}
            >
                {/* {!props.selected &&
                    <div
                        className="absolute top-0 left-0 w-full h-full rounded-xl bg-black/80"
                    />
                } */}
            </div>
        </Tilt>
    )
}