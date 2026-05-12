'use client';
import InputText from "@/components/input/InputText";
import Curve from "./Curve";
import InputButton from "@/components/input/InputButton";
import { LogInIcon, UserRoundPlusIcon } from "lucide-react";
import Logo from "@/components/Logo";
import { Fragment, useEffect, useState } from "react";
import MovingRow from "./MovingRow";
import { books } from "./books";
import BookCard from "./BookCard";


export default function Page() {
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
    }, []); 

    
    return (
        <div className="w-screen h-screen max-w-screen max-h-screen p-2 grid grid-cols-[1fr_2fr] grid-rows-1 gap-x-2 bg-neutral-950">
            <main className="flex flex-col justify-between">
                <div className="relative h-full flex flex-col justify-center items-center gap-y-12">
                    <div className="flex flex-col items-center gap-y-6">
                        <div className="w-min p-1 flex gap-x-1 bg-neutral-900 border border-neutral-800 rounded-[9px]">
                            <button className="px-2 py-0.5 flex items-center gap-x-1 bg-neutral-800 border border-neutral-800 rounded-md shadow">
                                <LogInIcon
                                    size={12}
                                    className="text-neutral-100"
                                />
                                <label className="text-xs text-neutral-100 whitespace-nowrap">
                                    Log In
                                </label>
                            </button>
                            <button className="px-2 py-0.5 flex items-center gap-x-1 rounded-md hover:bg-neutral-900">
                                <UserRoundPlusIcon
                                    size={12}
                                    className="text-neutral-500"
                                />
                                <label className="text-xs text-neutral-500 whitespace-nowrap">
                                    Sign Up
                                </label>
                            </button>
                        </div>
                        <header className="max-w-2xs flex flex-col gap-y-1">
                            <h1 className="text-3xl text-neutral-100 text-center font-medium tracking-tight">
                                Welcome Back
                            </h1>
                            <p className="text-sm text-center">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                            </p>
                        </header>
                    </div>
                    <form
                        onSubmit={(e) => e.preventDefault()}
                        className="min-w-xs flex flex-col gap-y-6"
                    >
                        <InputText
                            label="Email"
                        />
                        <InputText
                            type="password"
                            label="Password"
                        />
                        <div className="flex flex-col gap-y-3">
                            <InputButton
                                label="Log In"
                            />
                            <p className="text-sm text-center">
                                Don't have an account yet?
                                <span className="ml-1 text-neutral-100 cursor-pointer">
                                    Sign Up
                                </span>
                            </p>
                        </div>
                    </form>
                </div>
                <div className="relative bottom-0 w-full h-fit self-end">
                    <p className="text-sm text-neutral-500/75 text-center whitespace-nowrap">
                        By creating an account, you agree to read.
                    </p>
                </div>
            </main>
            <div className="relative w-full h-full p-2 bg-neutral-800 rounded-4xl">
                <div className="absolute top-0 right-0 z-100 w-[calc(50%-1rem)] h-[calc(50%-1rem)] mr-2 mt-2 flex flex-col items-center justify-center gap-y-4 bg-neutral-800 rounded-tr-2xl">
                    {/* <span className="block text-4xl text-neutral-100 tracking-tight font-medium">
                        Read to Recall
                    </span>
                    <Logo/>
                    <span className="block text-4xl text-blue-900 tracking-tight font-medium -scale-y-100">
                        Read to Recall
                    </span> */}
                </div>
                <div className="relative w-full h-full p-2 flex flex-col gap-y-2 bg-neutral-100 rounded-3xl overflow-clip">
                    {[...Array(6)].map((e, i) => (
                        <Fragment key={i}>
                            <MovingRow
                                books={books.slice(i*12, (i+1)*12)}
                                selectedBook={book}
                                reverse={i %2 === 0}
                                onClickBook={(book) => {
                                    setBook(book);
                                    setUserSelected(false);
                                }}
                            />
                        </Fragment>
                    ))}
                    <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-neutral-800 rounded-bl-3xl rounded-tr-2xl">
                        <Curve
                            className="absolute top-0 -left-4 w-4 h-4 rotate-270"
                            pathClassName="fill-neutral-800"
                        />
                        <Curve
                            className="absolute -bottom-4 right-0 w-4 h-4 rotate-270"
                            pathClassName="fill-neutral-800"
                        />
                    </div>
                    <div className="absolute bottom-0 left-0 w-1/2 h-1/3 p-2 pl-0 pb-0 bg-neutral-800 rounded-tr-4xl rounded-bl-2xl">
                        <Curve
                            className="absolute bottom-0 -right-4 w-4 h-4 rotate-90"
                            pathClassName="fill-neutral-800"
                        />
                        <Curve
                            className="absolute -top-4 left-0 w-4 h-4 rotate-90"
                            pathClassName="fill-neutral-800"
                        />
                        <div className="relative w-full h-full bg-neutral-100 rounded-3xl overflow-clip">
                            <BookCard
                                book={book}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}