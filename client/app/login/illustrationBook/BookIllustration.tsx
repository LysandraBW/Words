import { Fragment } from "react/jsx-runtime";
import { books } from "../books";
import BookCard from "./BookCard";
import Curve from "./Curve";
import HeroCard from "./HeroCard";
import MovingRow from "./MovingRow";
import { useEffect, useState } from "react";

export default function BookIllustration() {
    const [book, setBook] = useState<typeof books[number] | null>(null);
    const [userSelected, setUserSelected] = useState(false);


    useEffect(() => {
        const id = setInterval(() => {
            if (userSelected)
                return;
            // Source - https://stackoverflow.com/a/1527834
            // Posted by Darin Dimitrov
            // Retrieved 2026-05-11, License - CC BY-SA 2.5
            const n = Math.floor(Math.random() * (books.length - 1));
            setBook(books[n]);
        }, 5000);
        return () => clearInterval(id);
    }, [userSelected]); 

    
    return (
        <div className="max-lg:hidden relative w-full h-full p-2 bg-neutral-800 rounded-4xl">
            <div className="absolute top-0 right-0 z-100 w-[calc(50%-12px)] h-[calc(50%-5px)] mr-2 mt-2 flex flex-col items-center justify-center gap-y-4 bg-neutral-800 rounded-bl-4xl rounded-tr-2xl">
                <Curve
                    className="absolute top-0 -left-6 w-6 h-6 rotate-270"
                    pathClassName="fill-neutral-800"
                />
                <Curve
                    className="absolute -bottom-6 right-0 w-6 h-6 rotate-270"
                    pathClassName="fill-neutral-800"
                />
                <div className="relative w-full h-full rounded-tr-3xl rounded-bl-3xl overflow-clip">
                    <HeroCard/>
                </div>
            </div>
            <div className="relative w-full h-full p-2 flex flex-col gap-y-2 bg-neutral-900 rounded-3xl overflow-clip cursor-[url('/images/handpointing.svg'),_pointer]">
                {[...Array(3)].map((e, i) => (
                    <Fragment key={i}>
                        <MovingRow
                            rows={3}
                            cols={6}
                            books={books.slice(i*26, (i+1)*26)}
                            selectedBook={book}
                            reverse={i % 2 === 0}
                            onSelectBook={(book) => {
                                setBook(book);
                                setUserSelected(true);
                                setTimeout(() => {
                                    setUserSelected(false);
                                }, 1000 * 10);
                            }}
                        />
                    </Fragment>
                ))}
            </div>
            <div className="absolute bottom-0 left-0 w-[calc(50%-12px)] h-[calc(33%-5px)] ml-2 mb-2 p-2 pb-0 pl-0 bg-neutral-800 rounded-tr-4xl rounded-bl-2xl">
                <Curve
                    className="absolute bottom-0 -right-6 w-6 h-6 rotate-90"
                    pathClassName="fill-neutral-800"
                />
                <Curve
                    className="absolute -top-6 left-0 w-6 h-6 rotate-90"
                    pathClassName="fill-neutral-800"
                />
                <div className="relative w-full h-full bg-neutral-100 rounded-3xl overflow-clip">
                    <BookCard
                        book={book}
                    />
                </div>
            </div>
        </div>
    )
}