import { Fragment, useEffect, useState } from "react"
import { books } from "../../books";
import Choice from "./Choice";
import { nunito } from "@/app/fonts";
import { CircleQuestionMark, Clock4Icon, LayoutGridIcon, TargetIcon } from "lucide-react";
import { motion } from "framer-motion";
import Circle from "./Circle";

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
            <div className="absolute top-0 left-0 w-full h-full overflow-clip bg-neutral-900 rounded-4xl">
                
                {[...Array(22)].map((e, i) => (
                    <Fragment key={i}>
                        <Circle
                            i={i - 10}
                        />
                    </Fragment>
                    // <motion.svg 
                    //     key={i}
                    //     xmlns="http://www.w3.org/2000/svg"
                    //     viewBox="0 0 150 150"
                    //     className="absolute block overflow-visible drop-shadow-md"
                    //     style={{
                    //         top: `${(i-20)*32}px`,
                    //         left: `${(i-20)*32}px`,
                    //         width: `calc(100% - ${(i-20)*64}px)`,
                    //         height: `calc(100% - ${(i-20)*64}px)`,
                    //         // transform: `rotate(${(i % 2 === 0 ? 1 : -1)*6}deg)`
                    //     }}
                    //     // initial={{ rotate: (i % 2 === 0 ? 1 : -1)*6 }}
                    //     // animate={{ rotate: -(i % 2 === 0 ? 1 : -1)*6 }}
                    //     initial={{ rotate: 0 }}
                    //     animate={{ rotate: 0 + 360 }}
                    //     transition={{ 
                    //         duration: 5, 
                    //         repeat: Infinity, 
                    //         ease: "linear"
                    //         // repeatType: "reverse"
                    //     }}
                    // >
                    //     <path 
                    //         // d="M 75 75 m 75 0 a 75 75 0 1 0 -150 0 a 75 75 0 1 0 150 0"
                    //         d="M 0 60 A 75 75 0 0 1 75 0 A 75 75 0 0 1 150 60 M 150 90 A 75 75 0 0 1 75 150 A 75 75 0 0 1 0 90 M 0 90"
                    //         // d="M 0 75 A 75 75 0 0 1 75 0 A 75 75 0 0 1 150 75 M 150 90 A 75 75 0 0 1 75 165 A 75 75 0 0 1 0 90 M 0 90"
                    //         vectorEffect="non-scaling-stroke"
                    //         stroke="#262626" 
                    //         strokeWidth={15} 
                    //         strokeLinecap="round"
                    //         fill="none"
                    //     />
                    // </motion.svg>
                ))}
            </div>
            {/* <div className="relative z-100 w-full h-full flex items-center justify-center">
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
            </div> */}
        </div>
    )
}