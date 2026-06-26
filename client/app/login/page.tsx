'use client';
import { useState } from "react";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import BookPanel from "./panel/book/BookPanel";
import QuizPanel from "./panel/quiz/QuizPanel";
import PageToggle from "./PageToggle";
import motion from "framer-motion";


export default function Page() {
    const [page, setPage] = useState("signIn");    

    
    return (
        <div className="w-screen h-screen max-w-screen max-h-screen p-2 lg:grid lg:grid-cols-[1fr_2fr] lg:grid-rows-1 gap-x-2 bg-neutral-950 overflow-y-auto">
            <main className="relative h-full w-full px-2 py-2 pb-2 pr-4 flex flex-col justify-between items-center">
                {page === "signIn" ?
                    <SignIn
                        page={page}
                        onClickPage={setPage}
                    /> :
                    <SignUp
                        page={page}
                        onClickPage={setPage}
                    />
                }
            </main>
            {page === "signIn" ?
                <BookPanel/> :
                <QuizPanel/>
            }
        </div>
    )
}