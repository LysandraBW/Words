"use client";
import { useEffect, useState } from "react"
import { books } from "../login/books"
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";

export default function Page() {
    const [sortedBooks, setSortedBooks] = useState([...books]);

    const moveLeft = (i: number) => {
        if (i === 0)
            return;

        const updatedSortedBooks = [...sortedBooks];
        const j = i - 1;
        [updatedSortedBooks[i], updatedSortedBooks[j]] = [updatedSortedBooks[j], updatedSortedBooks[i]];
        console.log(sortedBooks);
        console.log(updatedSortedBooks);
        setSortedBooks(updatedSortedBooks);
    }

    const moveRight = (i: number) => {
        if (i === sortedBooks.length - 1)
            return;

        const updatedSortedBooks = [...sortedBooks];
        const j = i + 1;
        [updatedSortedBooks[i], updatedSortedBooks[j]] = [updatedSortedBooks[j], updatedSortedBooks[i]];
        setSortedBooks(updatedSortedBooks);
    }

    useEffect(() => {
        console.log(sortedBooks);
    }, [sortedBooks]);

    return (
        <div className="w-screen max-w-screen grid grid-cols-20 gap-4 gap-y-8 overflow-x-clip">
            {sortedBooks.map((book, i) => (
                <div 
                    key={book.title}
                    className="w-full aspect-1/2 flex flex-col items-center gap-2 overflow-clip"
                >
                    <div 
                        tabIndex={0}
                        className={`w-full aspect-1/2 bg-center bg-contain bg-no-repeat ${book.background} focus:border focus:border-blue-500`}
                        onKeyDown={(e) => {
                            if (e.key === "ArrowLeft") {
                                moveLeft(i);
                            }
                            else if (e.key === "ArrowRight") {
                                moveRight(i);
                            }
                        }}
                    />
                    <div className="flex gap-4">
                        <button 
                            onClick={() => moveLeft(i)}
                            className="p-1 bg-neutral-100 rounded-sm"
                        >
                            <ArrowLeftIcon
                                size={12}
                                strokeWidth={3}
                                className="stroke-blue-500"
                            />
                        </button>
                        <button
                            onClick={() => moveRight(i)} 
                            className="p-1 bg-neutral-100 rounded-sm"
                        >
                            <ArrowRightIcon
                                size={12}
                                strokeWidth={3}
                                className="stroke-blue-500"
                            />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    )
}