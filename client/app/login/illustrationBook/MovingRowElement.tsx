import clsx from "clsx";
import { books } from "./books";
import Tilt from 'react-parallax-tilt';
import { PinIcon, StarIcon } from "lucide-react";


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
            style={{"clip-path": "inset(0 0 0 0 1rem)"} as any}
            className={clsx(
                "relative w-[var(--w)] min-w-[var(--w)] h-full rounded-2xl overflow-hidden",
                // Testing Purposes
                // "[:nth-child(1)]:bg-red-500 [:nth-child(2)]:bg-red-600 [:nth-child(3)]:bg-orange-500 [:nth-child(4)]:bg-orange-600 [:nth-child(5)]:bg-yellow-500 [:nth-child(6)]:bg-yellow-600 [:nth-child(7)]:bg-green-500 [:nth-child(8)]:bg-green-600 [:nth-child(9)]:bg-blue-500 [:nth-child(10)]:bg-blue-600 [:nth-child(11)]:bg-indigo-500 [:nth-child(12)]:bg-indigo-600",
                // "[:nth-child(14)]:bg-red-600 [:nth-child(15)]:bg-orange-500 [:nth-child(16)]:bg-orange-600 [:nth-child(17)]:bg-yellow-500 [:nth-child(18)]:bg-yellow-600 [:nth-child(19)]:bg-green-500 [:nth-child(20)]:bg-green-600 [:nth-child(21)]:bg-blue-500 [:nth-child(22)]:bg-blue-600 [:nth-child(22)]:bg-indigo-500 [:nth-child(24)]:bg-indigo-600",
            )}
        >
            <div
                onClick={() => props.book && props.onClickBook(props.book)}
                className={clsx(
                    "relative w-full h-full",
                    "flex justify-center items-center",
                    "bg-center bg-cover bg-neutral-300"
                )}
            >
                {/* Blur */}
                <div className={clsx(
                    "absolute top-0 left-0 z-25 w-full h-full",
                    "bg-center bg-cover bg-neutral-300 blur-xs saturate-100 transition-all",
                    props.book && props.book.background
                )}/>
                {/* Black Overlay */}
                <div className={clsx(
                    "bg-black/75",
                    "absolute top-0 left-0 z-50 w-full h-full"
                )}/>
                {/* Image */}
                <img
                    src={props.book?.background.slice(9, -3)}
                    className="relative z-75 h-full"
                />
            </div>
        </Tilt>
    )
}