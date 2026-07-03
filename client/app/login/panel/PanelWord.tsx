import { Book } from "../books";
import CardWord from "./CardWord";
import { useState } from "react";
import Curve from "./Curve";
import MovingBooks from "./MovingBooks";
import Logo from "./Logo";


export default function PanelWord() {
    const [book, setBook] = useState<Book | null>(null);
    const [intervalState, setIntervalState] = useState("");


    return (
        <div className="sticky top-0 max-lg:hidden relative w-full h-full p-2 bg-neutral-800 rounded-4xl">
            <div className="absolute top-2 right-2 z-100 w-[128px] h-[52px] bg-transparent">
                <Curve
                    className="absolute top-0 -left-6 w-6 h-6 -rotate-90"
                    pathClassName="fill-neutral-800"
                />
                <Curve
                    className="absolute -bottom-6 right-0 w-6 h-6 -rotate-90"
                    pathClassName="fill-neutral-800"
                />
                <Logo/>
            </div>
            <div className="relative w-full h-full flex flex-col gap-y-2 bg-neutral-900 rounded-3xl overflow-clip cursor-[url('/images/handpointing.svg'),_pointer]">
                <MovingBooks
                    state={intervalState}
                    onBookSelected={setBook}
                />
            </div>
            <div className="absolute bottom-0 [--w:min(50%,500px)] left-[calc(50%-calc(var(--w)/2))] w-[var(--w)] h-[calc(33%-5px)] ml-2- mb-2 p-2 pb-0 bg-neutral-800 rounded-t-4xl rounded-b-0">
                <Curve
                    className="absolute bottom-0 -left-6 w-6 h-6 rotate-0"
                    pathClassName="fill-neutral-800"
                />
                <Curve
                    className="absolute bottom-0 -right-6 w-6 h-6 rotate-90"
                    pathClassName="fill-neutral-800"
                />
                <div className="relative w-full h-full bg-neutral-900 rounded-3xl overflow-clip">
                    {book &&
                        <CardWord
                            book={book}
                            pauseInterval={() => setIntervalState("STOP")}
                            startInterval={() => setIntervalState("CONT")}
                        />
                    }
                </div>
            </div>
        </div>
    )
}