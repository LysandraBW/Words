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
            className="relative w-[var(--w)] min-w-[var(--w)] h-full rounded-2xl overflow-hidden"
        >
            <div
                onClick={() => props.book && props.onClickBook && props.onClickBook(props.book)}
                className={clsx(
                    "relative w-full h-full",
                    "flex justify-center items-center"
                )}
            >
                <div className={`absolute -top-1/2 -left-1/2 z-50 w-[200%] h-[200%] ${props.book?.background} blur saturate-120`}/>
                <img
                    src={props.book?.background.slice(9, -3)}
                    className="relative z-75 h-full"
                />
            </div>
        </Tilt>
    )
}