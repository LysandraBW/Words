"use client";
import { useEffect, useState } from "react"
import { books } from "../login/books"
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { shuffle } from "@/utilities/array";

export default function Page() {
    const [sortedBooks, setSortedBooks] = useState([...books]);

    const moveLeft = (i: number) => {
        if (i === 0)
            return;

        const updatedSortedBooks = [...sortedBooks];
        const j = i - 1;
        [updatedSortedBooks[i], updatedSortedBooks[j]] = [updatedSortedBooks[j], updatedSortedBooks[i]];
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
    

    return (
        <div className="grid grid-cols-6 overflow-x-clip">
            {sortedBooks.map((book, i) => (
                <div 
                    key={book.title}
                    className="w-full aspect-1/2 flex flex-col items-center gap-0 overflow-clip"
                >
                    <div 
                        tabIndex={0}
                        style={{
                            backgroundImage: `url(${book.background})`
                        }}
                        className={`w-full aspect-1/2 bg-center bg-cover object-contain bg-no-repeat focus:border focus:border-blue-500`}
                        onKeyDown={(e) => {
                            if (e.key === "ArrowLeft") {
                                moveLeft(i);
                            }
                            else if (e.key === "ArrowRight") {
                                moveRight(i);
                            }
                        }}
                    />
                    {/* <div className="flex gap-4">
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
                    </div> */}
                </div>
            ))}
        </div>
    )
}