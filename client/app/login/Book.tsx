import clsx from "clsx";
import { books } from "./books";

export type BookType = {
    title: string;
    author: string;
    color: string;
    darkerColor: string;
    word: string;
    definition: string;
    speech: string;
    background: string;
};


export default function Book({book, i, selected, color, darkerColor}: {book: BookType; i: number; selected: boolean; color: string; darkerColor: string;}) {
    return (
        <div className="w-full h-full rounded-t-md saturate-10- brightness-50" style={{background: color}}>
            
        </div>
    )
}


// <svg 
        //     viewBox="0 0 50 100" 
        //     xmlns="http://www.w3.org/2000/svg"
        //     className={clsx(
        //         "row-start-1 w-full h-full inset-0",
        //         "transition-all duration-300 ease-out",
        //         !selected && "hover:-translate-y-1/32 active:-translate-y-1/16",
        //         selected && "-translate-y-0"
        //     )}
        //     style={{
        //         zIndex: i,
        //         position: 'absolute'
        //     }}
        //     preserveAspectRatio="none"
        // >
        //     <polygon 
        //         points="0,25 25,25 25,100, 0,100"
        //         fill={i % 2 === 0 ? color : color}
        //         style={{
        //             'filter': `brightness(${1-((i-3)/books.length)}) saturate(${1+((i-3)/books.length)})`
        //         }}
        //         className={clsx(
        //             i % 2 !== 0 && 'saturate-120'
        //         )}
        //     />
        //     <polygon 
        //         points="25,25 50,0 50,75 25,100"
        //         fill={i % 2 === 0 ? color : darkerColor}
        //         className='brightness-50'
        //     />
        //     <polygon 
        //         points="0,25 25,0 50,0 25,25" 
        //         className='fill-neutral-100'
        //     />
        // </svg>