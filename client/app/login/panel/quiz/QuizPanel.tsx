import { useEffect, useState } from "react"
import { books } from "../../books";
import Choice from "./Choice";
import { nunito } from "@/app/fonts";
import { CircleQuestionMark, Clock4Icon, LayoutGridIcon, TargetIcon } from "lucide-react";

export default function QuizPanel() {
    const [questions, setQuestions] = useState<(typeof books[number])[]>();
    const [questionIndex, setQuestionIndex] = useState(-1);
    const [choices, setChoices] = useState<(number|null)[]>([null, null, null, null, null]);


    useEffect(() => {
        const shuffle = [...Array(books.length)].map((e, i) => i).sort(() => Math.random() - 0.5).slice(0, 5);
        const questions = shuffle.map(i => books[i]);
        setQuestions(questions);
        setQuestionIndex(0);
    }, []);


    const selectChoice = (choiceIndex: number) => {
        const updatedChoices = [...choices];
        updatedChoices[questionIndex] = choiceIndex;
        setChoices(updatedChoices);
    }


    return (
        <div className="sticky top-0 max-lg:hidden relative w-full h-full p-2 flex flex-col bg-neutral-800 rounded-4xl">
            <div className="absolute top-0 left-0 w-full h-full overflow-clip bg-white rounded-4xl">
                {[...Array(40)].map((e, i) => (
                    <svg 
                        key={i}
                        xmlns="http://www.w3.org/2000/svg" 
                        // viewBox="0 0 48 48" 
                        viewBox="0 0 150 150"
                        // viewBox="0 0 96 48" 
                        // preserveAspectRatio="none" 
                        className="absolute block overflow-visible"
                        style={{
                            top: `${(i-20)*32}px`,
                            left: `${(i-20)*32}px`,
                            width: `calc(100% - ${(i-20)*64}px)`,
                            height: `calc(100% - ${(i-20)*64}px)`
                        }}
                    >
                        <path 
                            d="M 75 75 m 75 0 a 75 75 0 1 0 -150 0 a 75 75 0 1 0 150 0"
                            // d="M 0 4 A 4 4 0 0 1 4 0 H 44 A 4 4 0 0 1 48 4 V 44 A 4 4 0 0 1 44 48 H 4 A 4 4 0 0 1 0 44 V 4" 
                            // d="M 0 4 A 4 4 0 0 1 4 0 H 92 A 4 4 0 0 1 96 4 V 44 A 4 4 0 0 1 92 48 H 4 A 4 4 0 0 1 0 44 V 4"
                            // d="M 0 1 A 1 1 0 0 1 1 0 H 95 A 1 1 0 0 1 96 1 V 47 A 1 1 0 0 1 95 48 H 1 A 1 1 0 0 1 0 47 V 1"
                            // d="M 0 4 A 4 4 0 0 1 4 0 H 92 A 4 4 0 0 1 96 4 V 44 A 4 4 0 0 1 92 48 H 4 A 4 4 0 0 1 0 44 V 4"
                            // d="M 0 2 A 2 2 0 0 1 2 0 H 94 A 2 2 0 0 1 96 2 V 46 A 2 2 0 0 1 94 48 H 2 A 2 2 0 0 1 0 46 V 2"
                            vectorEffect="non-scaling-stroke"
                            stroke="#262626" 
                            strokeWidth={10} 
                            fill="none"
                        />
                    </svg>
                ))}
            </div>
            <div className="relative z-100 w-full h-full flex items-center justify-center">
                <div className="w-1/2 flex flex-col bg-neutral-900 rounded-3xl ring-6 ring-neutral-950/60">
                    <div className="w-full h-12 px-4 py-4 flex items-center gap-x-2 rounded-t-3xl">
                        <div className="w-3 h-3 aspect-square bg-green-500 rounded-full">
                        </div>
                        <div className="w-3 h-3 aspect-square bg-red-500 rounded-full">
                        </div>
                        <div className="w-3 h-3 aspect-square bg-neutral-800 rounded-full">
                        </div>
                        <div className="w-3 h-3 aspect-square bg-neutral-800 rounded-full">
                        </div>
                        <div className="w-full h-3 bg-neutral-800 rounded-full">
                            <div className="w-1/2 h-full bg-blue-500 rounded-full"/>
                        </div>
                    </div>
                    <div className="w-full flex flex-col grow justify-center">
                        <div className="w-full h-full pb-4 flex flex-col gap-4">
                            <div className="w-full min-h-1/2 p-1 flex flex-col bg-blue-500">
                                <div className="p-1 w-full flex gap-1 border border-blue-600 rounded-lg shadow-xs">
                                    <span className={`block w-min px-1 py-0.5 flex items-center gap-1 border border-blue-600 rounded-md shadow-xs text-xs text-blue-200 font-medium tracking-wide whitespace-nowrap`}>
                                        <Clock4Icon size={12}/> 00:00:00s
                                    </span>
                                    <span className={`block w-min px-1 py-0.5 flex items-center gap-1 border border-blue-600 rounded-md shadow-xs text-xs text-blue-200 font-medium tracking-wide whitespace-nowrap`}>
                                        <CircleQuestionMark size={12}/> {questionIndex+1} out of {questions?.length}
                                    </span>
                                </div>
                                <div className="min-h-[78px] flex flex-col grow items-center justify-center">
                                    {(questions && questionIndex !== -1) &&
                                        <span className="block text-2xl text-neutral-100 font-semibold whitespace-nowrap">
                                            {[...questions[questionIndex].word].map((c, i, arr) => (i === 0 || (i > 0 && (arr[i-1] === " " || arr[i-1] === "-"))) ? c.toLowerCase() : c.toLowerCase())}
                                        </span>
                                    }
                                </div>
                            </div>
                            <div className="w-full h-full px-4 flex justify-center gap-x-4">
                                <Choice
                                    onClick={() => selectChoice(0)}
                                    content="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
                                    flag={choices[0] !== null ? true : null}
                                    selected={choices[0] === 0}
                                    answered={choices[0] !==  null}
                                />
                                <Choice
                                    onClick={() => selectChoice(1)}
                                    content="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
                                    flag={choices[0] !== null ? false : null}
                                    selected={choices[0] === 1}
                                    answered={choices[0] !==  null}
                                />
                            </div>
                            <div className="w-full h-full px-4 flex justify-center gap-x-4">
                                <Choice
                                    onClick={() => selectChoice(2)}
                                    content="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
                                    flag={choices[0] !== null ? false : null}
                                    selected={choices[0] === 2}
                                    answered={choices[0] !==  null}
                                />
                                <Choice
                                    onClick={() => selectChoice(3)}
                                    content="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
                                    flag={choices[0] !== null ? false : null}
                                    selected={choices[0] === 3}
                                    answered={choices[0] !==  null}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}