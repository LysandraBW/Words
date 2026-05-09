'use client';
import clsx from "clsx";
import Logo from "@/components/Logo";
import InputText from "@/components/input/InputText";
import InputButton from "@/components/input/InputButton";
import { useEffect, useRef, useState } from "react";
import { BookType } from "./Book";
import Book from "./Book";
import Noise from "./Noise";
import { books } from "./books";


export default function Page() {
    const ref = useRef(null);
    const [bookIndex, setBookIndex] = useState(1);


    useEffect(() => {
        const box = ref.current as any;
        if (!box)
            return;

        const numBooks = books.length - 2;

        // Initialize
        box.style.setProperty("--width", `${box.clientWidth / numBooks}px`);
        box.classList.remove('invisible');

        // Update on Resize
        const observer = new ResizeObserver(([entry]) => (entry?.target as any)?.style.setProperty("--width", `${entry.contentRect.width / numBooks}px`));
        observer.observe(box);
        return observer.disconnect;
    }, [ref]);


    return (
        <div className="w-full h-full grid grid-cols-12 gap-x-6 gap-y-6">
            <div className="col-start-1 col-span-7 row-start-1 bg-black">
                <div 
                    className={clsx(
                        "relative",
                        "w-full h-full grid grid-rows-[75%_calc(25%+50px)] grid-cols-1 justify-between overflow-clip",
                        "bg-neutral-200 rounded-br-[200px]-", 
                        "cursor-[url('/images/handpointing.svg'),_pointer]"
                    )}
                >
                    <div className="row-start-1 row-span-1 flex flex-col justify-between items-center gap-y-6">
                        <Noise
                            color={books[bookIndex].color}
                            darkerColor={books[bookIndex].darkerColor}
                        />
                        <div className="relative z-100 w-full p-6">
                            <Logo/>
                        </div>
                        <div className="relative z-100 top-1/8 p-2 bg-white/75 backdrop-blur-xs border border-white/[0.25] rounded-xl shadow-xs">
                            <div 
                                className={clsx(
                                    "relative z-100 min-w-md w-md max-w-md h-34 p-2",
                                    "flex gap-x-2",
                                    "overflow-hidden",
                                    "bg-neutral-100 rounded-lg shadow-xs"
                                )}
                            >
                                <div 
                                    className={clsx(
                                        "relative",
                                        "h-full aspect-1/1.5 bg-black rounded-md",
                                        "bg-cover bg-center",
                                        books[bookIndex].background
                                    )}
                                />
                                <div className="min-w-0 h-full flex flex-col overflow-hidden">
                                    <span className="block text-xs tracking-wide">
                                        Related to 
                                        <span className="font-medium">
                                            {' '} {books[bookIndex].title}
                                        </span>
                                    </span>
                                    <div className="flex items-center gap-x-1">
                                        <span className="block text-blue-500 font-bold">
                                            {books[bookIndex].word}
                                        </span>
                                        <div className="w-1 h-1 relative top-[1px] bg-neutral-500"/>
                                        <span className="block relative top-[1.5px] text-xs tracking-wide uppercase">
                                            {books[bookIndex].speech}
                                        </span>
                                    </div>
                                    <p className="max-w-xs text-sm overflow-hidden text-ellipsis line-clamp-3">
                                        {books[bookIndex].definition}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div
                        ref={ref}
                        className={clsx(
                            // "invisible",
                            "row-start-2 row-span-1",
                            "w-[calc(100%+var(--width))]",
                            "grid grid-rows-1 gap-x-4",
                            "relative -left-[var(--width)]-",
                            // "bg-black"
                        )}
                        style={{
                            "gridTemplateColumns": `repeat(${books.length},var(--width))`
                        }}
                    >
                        {books.map((book, i) => (
                            <div
                                key={i}
                                onClick={() => setBookIndex(i)}
                                style={{
                                    position: 'relative',
                                    zIndex: i,
                                    left: -i + 'px'
                                }}
                            >
                                <Book
                                    i={i}
                                    book={book}
                                    selected={i === bookIndex}
                                    color={books[bookIndex].color}
                                    darkerColor={books[bookIndex].darkerColor}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <main
                className={clsx(
                    "m-6 ml-0",
                    "col-start-8 col-span-5 row-start-1",
                    "grid grid-rows-[auto_1fr] grid-cols-12",
                    "gap-x-6 gap-y-6"
                )}
            >
                <Logo/>
                <div className="row-start-2 col-start-4 col-span-6 min-w-3xs flex flex-col gap-y-12 justify-center mb-18">
                    <header className="flex flex-col gap-y-1">
                        <h1 className="text-3xl text-white text-center font-bold">
                            Welcome Back
                        </h1>
                        <p className="text-sm text-center">
                            Have you forgotten already?
                        </p>
                    </header>
                    <form
                        onSubmit={(e) => e.preventDefault()}
                        className="flex flex-col gap-y-6"
                    >
                        <InputText
                            value="abc@gmail.com"
                            label="Email"
                        />
                        <InputText
                            value="123"
                            type="password"
                            label="Password"
                        />
                        <InputButton
                            label="Sign In"
                        />
                    </form>
                </div>
            </main>
        </div>
    )
}