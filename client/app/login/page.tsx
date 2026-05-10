'use client';
import clsx from "clsx";
import Logo from "@/components/Logo";
import InputText from "@/components/input/InputText";
import InputButton from "@/components/input/InputButton";
import { Fragment, useEffect, useRef, useState } from "react";
import { books } from "./books";
import { AnimatePresence, motion } from "framer-motion";
import MovingColumn from "./MovingColumn";


export default function Page() {
    const ref = useRef<HTMLDivElement>(null);
    const [book, setBook] = useState<typeof books[number] | null>();


    useEffect(() => {
        if (!ref?.current)
            return;

        const element = ref.current;
        if (!element)
            return

        const update = () => {
            const entry = ref.current;
            if (!entry)
                return;

            const w = (entry.parentElement as any).offsetWidth;
            const h = (entry.parentElement as any).offsetHeight;
            const hypotenuse = Math.sqrt(w * w + h * h);
            (entry as any).style.width = hypotenuse + 'px';
            (entry as any).style.height = hypotenuse + 'px';
        };

        update();
        window.addEventListener('resize', update);
        return () => window.removeEventListener('resize', update);
    }, [ref]);


    return (
        <div className="relative w-[calc(100vw-24px)] h-[calc(100vh-16px)] max-w-[calc(100vw-24px)] max-h-[calc(100vh-16px)] m-2 grid grid-cols-[60%_40%] gap-x-2">
            <div className="relative w-full h-full max-w-full max-h-full min-w-0 min-h-0 bg-neutral-100 cursor-[url('/images/handpointing.svg'),_pointer]">
                <div
                    className="relative w-full h-full max-w-full max-h-full overflow-clip"
                >
                    <div 
                        ref={ref}
                        className="absolute flex gap-x-2 -rotate-z-35 rotate-x-45 origin-top-left -translate-x-2/3 translate-y-1/2 perspective-[900px] transform-3d"
                    >
                        {[...Array(20)].map((e, i) => (
                            <Fragment key={i}>
                                <MovingColumn
                                    books={!books ? [null, null, null, null, null, null] : [...books, ...books].slice(i*6, (i+1)*6)}
                                    reverse={i % 2 === 0}
                                    colIdx={i}
                                    numCols={20}
                                    onClickBook={setBook}
                                />
                            </Fragment>
                        ))}
                    </div>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10" className="absolute -top-0 right-0 w-8 h-8 rotate-270">
                    <path d="M 0 10 L 10 10 L 10 0 A 10 10 10 0 1 0 10" className="fill-neutral-950"/>
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10" className="absolute -bottom-0 left-0 w-8 h-8 rotate-90">
                    <path d="M 0 10 L 10 10 L 10 0 A 10 10 10 0 1 0 10" className="fill-neutral-950"/>
                </svg>
                <div className="absolute top-0 left-0 min-w-1/2 min-h-[248px] p-6 flex flex-col gap-y-6 bg-neutral-950 rounded-br-4xl cursor-default">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10" className="absolute -top-0 -right-8 w-8 h-8 rotate-180">
                        <path d="M 0 10 L 10 10 L 10 0 A 10 10 10 0 1 0 10" className="fill-neutral-950"/>
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10" className="absolute -bottom-8 -left-0 w-8 h-8 rotate-180">
                        <path d="M 0 10 L 10 10 L 10 0 A 10 10 10 0 1 0 10" className="fill-neutral-950"/>
                    </svg>
                    <Logo/>
                    <div className="flex grow items-end">
                        <span className="text-4xl text-neutral-100 tracking-tight font-bold">
                            Read.<br/>Remember.
                        </span>
                    </div>
                </div>
                <div className="absolute bottom-0 right-0 min-w-1/2 max-w-1/2 min-h-[200px] p-2 pr-0 pb-0 flex flex-col gap-y-6 bg-neutral-950 rounded-tl-4xl cursor-default">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10" className="absolute -top-8 right-0 w-8 h-8">
                        <path d="M 0 10 L 10 10 L 10 0 A 10 10 10 0 1 0 10" className="fill-neutral-950"/>
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10" className="absolute -bottom-0 -left-8 w-8 h-8 rotate-0">
                        <path d="M 0 10 L 10 10 L 10 0 A 10 10 10 0 1 0 10" className="fill-neutral-950"/>
                    </svg>
                    <div className="relative w-full h-full flex grow rounded-3xl bg-neutral-100 overflow-clip">
                        <AnimatePresence>
                            <motion.div
                                key={book?.title}
                                initial={{ y: "100%" }}
                                animate={{ y: 0 }}
                                exit={{ y: "-100%" }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                className="absolute w-full h-full p-2 flex gap-x-2 overflow-clip"
                            >
                                <div 
                                    className={clsx(
                                        "h-full aspect-2/3 bg-cover bg-center rounded-2xl",
                                        !book && "bg-neutral-300",
                                        book && book.background
                                    )}
                                />
                                <div
                                    className={clsx(
                                        "w-full min-w-0 h-full flex flex-col justify-center px-2",
                                        !book && "bg-neutral-300 text-neutral-300 select-none rounded-2xl"
                                    )}
                                >
                                    {book &&
                                        <>
                                            <span className="block text-xs tracking-wide">
                                                Related to 
                                                <span className="font-medium">
                                                    {' '}{book.author}{'\'s '}
                                                </span>
                                                <span className="font-medium italic">
                                                    {book.title}
                                                </span>
                                            </span>
                                            <div className="mb-1 flex flex-wrap items-center gap-x-1">
                                                <span className="block text-xl text-blue-500 font-bold">
                                                    {book.word}
                                                </span>
                                                <div className="flex items-center gap-x-1">
                                                    <div className="w-1 h-1 relative top-[1.5px] bg-neutral-500"/>
                                                    <span className="block relative top-[1.5px] text-xs tracking-wide uppercase">
                                                        {book.speech}
                                                    </span>
                                                </div>
                                            </div>
                                            <p className="text-sm overflow-hidden text-ellipsis line-clamp-5">
                                                {book.definition}
                                            </p>
                                        </>
                                    }
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
            <main
                className={clsx(
                    "relative w-full",
                    "flex flex-col justify-center items-center gap-y-12"
                )}
            >
                <header className="max-w-2xs flex flex-col gap-y-1">
                    <h1 className="text-3xl text-white text-center font-medium tracking-tight">
                        Welcome Back
                    </h1>
                    <p className="text-sm text-center">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    </p>
                </header>
                <form
                    onSubmit={(e) => e.preventDefault()}
                    className="min-w-xs flex flex-col gap-y-6"
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
            </main>
        </div>
    )
}