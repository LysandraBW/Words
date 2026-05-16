import { AudioLinesIcon, ClockIcon, PauseIcon, Volume2Icon, XIcon } from "lucide-react";
import { useState } from "react"
import { books } from "../../books";

export default function QuizPanel() {
    const [book, setBook] = useState<number>(0);
    const [quiz, setQuiz] = useState(false);

    return (
        <div className="sticky top-0 max-lg:hidden relative w-full h-full p-2 bg-neutral-800 rounded-4xl">
            <div className="w-full h-full flex flex-col bg-neutral-900 rounded-3xl">
                <div className="w-full h-12 px-4 py-4 flex items-center gap-x-2 border-b border-b-neutral-800 rounded-t-3xl">
                    <div className="w-3 h-3 aspect-square bg-green-500 rounded-full"/>
                    <div className="w-3 h-3 aspect-square bg-red-500 rounded-full"/>
                    <div className="w-3 h-3 aspect-square bg-neutral-800 rounded-full"/>
                    <div className="w-3 h-3 aspect-square bg-neutral-800 rounded-full"/>
                    <div className="w-full h-3 bg-neutral-800 rounded-full">
                        <div className="w-1/2 h-full bg-blue-500 rounded-full"/>
                    </div>
                    <XIcon
                        strokeWidth={3}
                        className="w-4 h-4 text-neutral-800"
                    />
                </div>
                <div className="w-full flex flex-col grow justify-center">
                    <div
                        style={{'--w': '275px', '--h': '125px'} as any} 
                        className="relative w-full h-full p-6 flex flex-col justify-center items-center gap-4 overflow-clip"
                    >
                        <div className="relative z-50 h-min flex justify-center">
                            <div className="relative w-[var(--w)] h-[var(--h)] p-2 flex justify-center items-center bg-neutral-800 border border-neutral-700/50 rounded-xl shadow-md overflow-clip">
                                <span className="relative z-100 text-xl text-neutral-100/75 font-medium">
                                    {books[book].word}
                                </span>
                            </div>
                        </div>
                        <div className="relative z-50 h-min flex justify-center gap-x-4">
                            <div className="w-[var(--w)] h-[var(--h)] p-2 flex justify-center items-center bg-neutral-800 border border-neutral-700/50 rounded-xl shadow-md">
                                <span className="text-sm text-neutral-500 text-center tracking-wide">
                                    {/* {books[(book+0)%(books.length)].definition} */}
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                                </span>
                            </div>
                            <div className="w-[var(--w)] h-[var(--h)] p-2 flex justify-center items-center bg-neutral-800 border border-neutral-700/50 rounded-xl shadow-md">
                                <span className="text-sm text-neutral-500 text-center tracking-wide">
                                    {/* {books[(book+1)%(books.length)].definition} */}
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                                </span>
                            </div>
                        </div>
                        <div className="relative z-50 h-min flex justify-center gap-x-4">
                            <div className="w-[var(--w)] h-[var(--h)] p-2 flex justify-center items-center bg-neutral-800 border border-neutral-700/50 rounded-xl shadow-md">
                                <span className="text-sm text-neutral-500 text-center tracking-wide">
                                    {/* {books[(book+2)%(books.length)].definition} */}
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                                </span>
                            </div>
                            <div className="w-[var(--w)] h-[var(--h)] p-2 flex justify-center items-center bg-neutral-800 border border-neutral-700/50 rounded-xl shadow-md">
                                <span className="text-sm text-neutral-500 text-center tracking-wide">
                                    {/* {books[(book+3)%(books.length)].definition} */}
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}