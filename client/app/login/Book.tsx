import clsx from "clsx";

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


export default function Book({book, i, selected}: {book: BookType; i: number; selected: boolean}) {
    const color = i % 4 === 0 ? 'fill-blue-300' : i % 4 === 1 ? 'fill-blue-400' : i % 4 === 2 ? 'fill-blue-500' : 'fill-blue-600';

    return (
        <svg 
            viewBox="0 0 50 100" 
            xmlns="http://www.w3.org/2000/svg"
            className={clsx(
                "row-start-1 w-full h-full inset-0",
                "transition-all duration-50 ease-in-out",
                !selected && "hover:-translate-y-1/8",
                selected && "-translate-y-1/8 active:-translate-y-1/6"
            )}
            style={{
                zIndex: i,
                position: 'absolute'
            }}
            preserveAspectRatio="none"
        >
            <polygon 
                points="0,25 25,25 25,100, 0,100"
                fill={book.darkerColor}
                className={`${color}- saturate-10-`}
            />
            <polygon 
                points="25,25 50,0 50,75 25,100"
                fill={book.darkerColor}
                className={`${color}- saturate-50 brightness-50`}
            />
            <polygon 
                points="0,25 25,0 50,0 25,25" 
                className='fill-neutral-100'
            />
        </svg>
    )
}