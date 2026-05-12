import clsx from "clsx";
import { scribble } from "../../fonts";


interface StickyNoteProps {
    text: string;
    background: string;
    backgroundDark: string;
    foreground: string;
    className: string;
}


export default function StickyNote(props: StickyNoteProps) {
    return (
        <div 
            className={clsx(
                props.className,
                "relative aspect-square flex flex-col",
                "bg-neutral-300 rounded-md shadow shadow-black/20",
                // props.background
            )}
        >
            <div 
                className={clsx(
                    "relative top-0 left-0 w-full h-5",
                    "bg-neutral-400 rounded-t-md",
                    // props.backgroundDark
                )}
            />
            <div className="p-1 flex flex-col grow justify-center items-center">
                <span 
                    className={clsx(
                        scribble.className,
                        // props.foreground,
                        "text-center text-neutral-400 leading-4"
                    )}
                >
                    {props.text}
                </span>
            </div>
        </div>
    )
}