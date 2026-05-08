'use client';
import clsx from "clsx";
import { SmileIcon } from "lucide-react";
import { nanumPenScript, pixelifySans, scribble } from "../fonts";
import { useState } from "react";


const words = [
    {
        label: 'liminal',
        speech: 'adjective',
        definition: 'of, relating to, or being an intermediate state, phase, or condition',
        image: 'Backrooms.jpg'
    },
    {
        label: 'bathypelagic',
        speech: 'adjective',
        definition: 'of, relating to, or living in the ocean depths especially between approximately 2000 and 12,000 feet (600 and 3600 meters)',
        image: 'Deep-Ocean-Canyon.webp'
    },
    {
        label: 'interstellar',
        speech: 'adjective',
        definition: 'located, taking place, or traveling among the stars especially of the Milky Way galaxy',
        image: 'Space.jpg'
    }
];


export default function Page() {
    const [wordIndex, setWordIndex] = useState(2);


    return (
        <div className="w-full h-full grid grid-cols-12 gap-x-6 gap-y-6 bg-white">
            <div 
                className={clsx(
                    "col-span-8 col-start-1 row-start-1",
                    "grid grid-cols-12 grid-rows-[auto_1fr] gap-x-6 gap-y-6",
                    "bg-cover",
                    wordIndex === 0 && "bg-[url('/images/liminal.jpg')]",
                    wordIndex === 1 && "bg-[url('/images/ocean.webp')]",
                    wordIndex === 2 && "bg-[url('/images/space.jpg')]"
                )}
            >
                <div className="p-6 col-span-12 row-start-1">
                    <a 
                        href="/"
                        className="w-fit flex items-center gap-1"
                    >
                        <div className="w-4 h-4">
                            <SmileIcon
                                strokeWidth={2.5}
                                className="w-full h-full text-white"
                            />
                        </div>
                        <span 
                            className={clsx(
                                "block text-xl text-white",
                                scribble.className
                            )}
                        >
                            Words
                        </span>
                    </a>
                </div>
                <div
                    className={clsx(
                        "p-12 col-span-12 row-start-2 flex flex-col items-center justify-end gap-y-12"
                    )}
                >
                    <div className="w-min p-6 flex flex-col gap-y-2 bg-white border border-white/[0.08] rounded-2xl backdrop-blur-sm shadow-2xl shadow-white/50">
                        <div className="flex items-center gap-x-2">
                            <span className="block text-4xl text-black">
                                {words[wordIndex].label}
                            </span>
                            <div className="w-1 h-1 relative top-0.5 bg-white"/>
                            <span 
                                className={clsx(
                                    "block relative top-0.5 text-xs text-black tracking-widest uppercase",
                                    // scribble.className
                                )}
                            >
                                {words[wordIndex].speech}
                            </span>
                        </div>
                        <span className="block min-w-xs text-base text-black tracking-wide">
                            {words[wordIndex].definition}
                        </span>
                    </div>
                    <div className="flex justify-center gap-x-2">
                        {[...Array(words.length)].map((e, i) => (
                            <div
                                key={i}
                                className={clsx(
                                    "w-1 h-1",
                                    i === wordIndex && "w-7.5",
                                    "bg-white"
                                )}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}