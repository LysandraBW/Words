'use client';
import { useState } from "react";
import Login from "./Login";
import SignUp from "./SignUp";
import BookIllustration from "./illustrationBook/BookIllustration";


export default function Page() {
    const [page, setPage] = useState("signIn");    

    
    return (
        <div className="w-screen h-screen max-w-screen max-h-screen p-2 lg:grid lg:grid-cols-[1fr_2fr] lg:grid-rows-1 gap-x-2 bg-neutral-950">
            {page === "signIn" ?
                <Login
                    page={page}
                    onClickPage={setPage}
                /> :
                <SignUp
                    onSelectView={setPage}
                />
            }
            {page === "signIn" ?
                <BookIllustration/> :
                <BookIllustration/>
            }
        </div>
    )
}