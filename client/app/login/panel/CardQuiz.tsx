import { Fragment } from "react";
import Choice from "./Choice";
import { Question } from "./PanelQuiz";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";


interface CardQuizProps {
    question: Question | null;
    selectChoice: ((choiceIndex: number) => void) | null;
    pauseInterval: () => void;
    startInterval: () => void;
}


export default function CardQuiz(props: CardQuizProps) {
    const answered = props.question && props.question.selectedOptionIndex !== -1;

    return (
        <AnimatePresence
            initial={false}
        >
            <motion.div
                key={props.question?.label || ''}
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "-100%" }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="absolute top-0 left-0 w-full h-full p-2 flex gap-x-2 bg-neutral-900 overflow-clip"
            >
                <div 
                    className="absolute top-0 left-0 w-full h-full grid grid-rows-1 bg-neutral-900 overflow-clip"
                    onMouseEnter={props.pauseInterval}
                    onMouseLeave={props.startInterval}    
                >
                    <div className="w-full h-full p-2 flex flex-col gap-y-2">
                        <div className="flex flex-col grow items-center justify-center rounded-2xl overflow-clip">
                            {!props.question &&
                                <div className="w-full h-full bg-neutral-800">
                                </div>
                            }
                            {props.question &&
                                <div className="relative w-full h-full flex justify-center items-center bg-neutral-800">
                                    <span className="max-w-[320px] text-base/5 text-neutral-500 font-medium text-center tracking-wide">
                                        {props.question.label.toLowerCase().slice(0, -1)}
                                    </span>
                                </div>
                            }
                        </div>
                        <div className="w-full min-h-1/3 grid grid-rows-2 grid-cols-2 gap-2">
                            {props.question === null &&
                                <>
                                    {[...Array(4)].map((e, i) => (
                                        <div
                                            key={i}
                                            className="w-full h-full bg-neutral-800 rounded-2xl"
                                        />
                                    ))}
                                </>
                            }
                            {props.question &&
                                <>
                                    {props.question.options.map((option, i) => (
                                        <Fragment
                                            key={i}
                                        >
                                            <Choice
                                                onClick={() => props.selectChoice && props.selectChoice(i)}
                                                content={option}
                                                flag={props.question?.correctOptionIndex === i}
                                                selected={props.question?.selectedOptionIndex !== i}
                                                answered={answered || false}
                                            />
                                        </Fragment>
                                    ))}
                                </>
                            }
                        </div>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    )
}