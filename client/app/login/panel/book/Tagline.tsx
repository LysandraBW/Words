import { useEffect, useState } from "react";
import { books } from "../../books";
import { CircleQuestionMarkIcon, Clock4Icon } from "lucide-react";
import Choice from "../quiz/Choice";
import clsx from "clsx";

export default function HeroCard() {
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
        <div className="absolute top-0 left-0 w-full h-full pl-2 pb-2 grid grid-rows-1 overflow-clip">
            <div className="w-full h-full p-2 flex flex-col gap-y-2 bg-neutral-100 rounded-2xl rounded-bl-3xl overflow-clip">
                <div className="w-full flex flex-col grow">
                    {/* <div className="w-full h-8 p-0.5 flex items-center gap-1 bg-neutral-300 rounded-full">
                        {(questions && questionIndex !== -1) &&
                            <>
                                <div
                                    className={clsx(
                                        "h-full aspect-square",
                                        "bg-neutral-300 bg-cover bg-center rounded-xl",
                                        questions[questionIndex] && questions[questionIndex].background
                                    )}
                                />
                                <span className="text-xs tracking-wide">
                                    From {questions[questionIndex] && questions[questionIndex].title}
                                </span>
                            </>
                        }
                    </div> */}
                    <div className="flex flex-col grow items-center justify-center bg-neutral-100 rounded-2xl rounded-tl-xl">
                        {(questions && questionIndex !== -1) &&
                            <span className="max-w-[400px] block text-xl text-neutral-800 font-medium text-center">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                            </span>
                        }
                    </div>
                </div>
                <div className="w-full h-1/2 grid grid-rows-2 grid-cols-2 gap-2">
                    <Choice
                        onClick={() => selectChoice(0)}
                        content="Word 1"
                        flag={choices[0] !== null ? true : null}
                        selected={choices[0] === 0}
                        answered={choices[0] !==  null}
                    />
                    <Choice
                        onClick={() => selectChoice(1)}
                        content="Word 2"
                        flag={choices[0] !== null ? false : null}
                        selected={choices[0] === 1}
                        answered={choices[0] !==  null}
                    />
                    <Choice
                        onClick={() => selectChoice(2)}
                        content="Word 3"
                        flag={choices[0] !== null ? false : null}
                        selected={choices[0] === 2}
                        answered={choices[0] !==  null}
                    />
                    <Choice
                        onClick={() => selectChoice(3)}
                        content="Word 4"
                        flag={choices[0] !== null ? false : null}
                        selected={choices[0] === 3}
                        answered={choices[0] !==  null}
                    />
                </div>
            </div>
        </div>
    )
}