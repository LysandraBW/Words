import { useEffect, useState } from "react"
import { books } from "../../books";
import Choice from "./Choice";
import { nunito } from "@/app/fonts";

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
        <div className="sticky top-0 max-lg:hidden relative w-full h-full p-2 bg-neutral-800 rounded-4xl">
            <div className="w-full h-full flex flex-col bg-neutral-900 rounded-3xl">
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
                        <div className="w-full min-h-1/2 flex flex-col justify-center items-center bg-neutral-950">
                            <div className="w-min flex flex-col gap-y-1">
                                {(questions && questionIndex !== -1) &&
                                    <>
                                        <span className={`block w-min px-1 py-0.5 bg-neutral-800 rounded-md text-xs font-bold tracking-wide whitespace-nowrap ${nunito.className}`}>
                                            {questionIndex+1}/{questions?.length}
                                        </span>
                                        <span className="block text-2xl font-medium whitespace-nowrap">
                                            Define
                                            <span className="ml-1.5 text-neutral-100">
                                                {/* Capitalize */}
                                                {[...questions[questionIndex].word].map((c, i, arr) => (i === 0 || (i > 0 && (arr[i-1] === " " || arr[i-1] === "-"))) ? c.toUpperCase() : c.toLowerCase())}
                                            </span>
                                        </span>
                                    </>
                                }
                            </div>
                        </div>
                        <div className="w-full h-full px-4 flex justify-center gap-x-4">
                            <Choice
                                onClick={() => selectChoice(0)}
                                content="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
                                flag={choices[0] !== null ? true : null}
                                selected={choices[0] === 0}
                            />
                            <Choice
                                onClick={() => selectChoice(1)}
                                content="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
                                flag={choices[0] !== null ? false : null}
                                selected={choices[0] === 1}
                            />
                        </div>
                        <div className="w-full h-full px-4 flex justify-center gap-x-4">
                            <Choice
                                onClick={() => selectChoice(2)}
                                content="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
                                flag={choices[0] !== null ? false : null}
                                selected={choices[0] === 2}
                            />
                            <Choice
                                onClick={() => selectChoice(3)}
                                content="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
                                flag={choices[0] !== null ? false : null}
                                selected={choices[0] === 3}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}