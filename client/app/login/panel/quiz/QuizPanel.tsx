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
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 150 150"
                    className="absolute top-0 left-0 w-full h-full block overflow-visible"
                    preserveAspectRatio="xMidYMid slice"
                >
                    <defs>
                        <mask 
                            id="swirls"
                            x="0"
                            y="0"
                            width="150"
                            height="150"
                        >
                            <rect width="150" height="150" fill="black"/>
                            {[...Array(25)].map((e, i) => (
                                <Fragment key={i}>
                                    <Circle
                                        i={i - 10}
                                        size={25}
                                    />
                                </Fragment>
                            ))}
                        </mask>
                    </defs>
                    <image
                        href="https://images.pexels.com/photos/16452613/pexels-photo-16452613.jpeg"
                        x="0"
                        y="0"
                        width="100%"
                        height="100%"
                        preserveAspectRatio="xMidYMid slice"
                        mask="url(#swirls)"
                    />
                </svg>
            </div>
            <div className="relative z-100 w-full h-full flex items-center justify-center">
                <div className="w-[524px] flex flex-col bg-neutral-900 rounded-3xl ring-6 ring-neutral-800">
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
                            <div className="w-full min-h-1/2 p-1 flex flex-col bg-neutral-300">
                                <div className="p-1 w-full flex gap-1 bg-neutral-300 border border-neutral-200 rounded-lg shadow-xs">
                                    <span className={`block w-min px-1 py-0.5 flex items-center gap-1 border border-neutral-200 rounded-md shadow-xs text-xs text-neutral-400 font-medium tracking-wide whitespace-nowrap`}>
                                        <Clock4Icon size={12}/> 00:00:00s
                                    </span>
                                    <span className={`block w-min px-1 py-0.5 flex items-center gap-1 border border-neutral-200 rounded-md shadow-xs text-xs text-neutral-400 font-medium tracking-wide whitespace-nowrap`}>
                                        <CircleQuestionMark size={12}/> {questionIndex+1} out of {questions?.length}
                                    </span>
                                </div>
                                <div className="min-h-[78px] flex flex-col grow items-center justify-center">
                                    {(questions && questionIndex !== -1) &&
                                        <span className="block text-2xl text-neutral-800 font-semibold whitespace-nowrap">
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