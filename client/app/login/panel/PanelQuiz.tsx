import { Book, books } from "../books";
import CardQuiz from "./CardQuiz";
import { useEffect, useState } from "react";
import Curve from "./Curve";
import MovingBooks from "./MovingBooks";
import Logo from "./Logo";


export interface Question {
    title: string;
    label: string;
    options: string[];
    correctOptionIndex: number;
    selectedOptionIndex: number;
}


export default function PanelQuiz() {
    const [questions, setQuestions] = useState<Question[]>();
    const [questionIndex, setQuestionIndex] = useState(-1);
    const [intervalState, setIntervalState] = useState("");


    useEffect(() => {
        const questions: Question[] = [];
        for (const book of books) {
            const optionIndices = new Set<number>();
            while (optionIndices.size < 3) {
                const optionIndex = Math.floor(Math.random() * books.length);
                if (optionIndices.has(optionIndex) || books[optionIndex].title === book.title)
                    continue;
                optionIndices.add(optionIndex);
            }

            const options = [...optionIndices].map((i: number) => books[i].word);
            const correctOptionIndex = Math.floor(Math.random() * 4);
            options.splice(correctOptionIndex, 0, book.word);

            questions.push({
                title: book.title,
                label: book.definition,
                options: options,
                correctOptionIndex: correctOptionIndex,
                selectedOptionIndex: -1
            });
        }
        
        setQuestions(questions);
        setQuestionIndex(0);
    }, []);

    
    const selectChoice = (choiceIndex: number) => {
        if (!questions)
            return;
        const updatedQuestions = [...questions].map((e, i) => i === questionIndex ? {...e, selectedOptionIndex: choiceIndex} : e);
        setQuestions(updatedQuestions);
    }


    return (
        <div className="sticky top-0 max-lg:hidden relative w-full h-full p-2 bg-neutral-900 rounded-4xl overflow-hidden">
            <div className="absolute top-2 right-2 z-100 w-[128px] h-[52px] bg-transparent">
                <Curve
                    className="absolute top-0 -left-6 w-6 h-6 -rotate-90"
                    pathClassName="fill-neutral-900"
                />
                <Curve
                    className="absolute -bottom-6 right-0 w-6 h-6 -rotate-90"
                    pathClassName="fill-neutral-900"
                />
                <Logo/>
            </div>
            <div className="relative w-full h-full bg-neutral-900 rounded-3xl overflow-clip cursor-[url('/images/handpointing.svg'),_pointer]">
                <MovingBooks
                    state={intervalState}
                    onBookSelected={(book: Book) => {
                        if (!questions)
                            return;
                        const questionIndex = questions.findIndex(question => question.title === book.title);
                        setQuestionIndex(questionIndex);
                    }}
                />
            </div>
            <div className="absolute bottom-0 [--w:min(50%,500px)] left-[calc(50%-calc(var(--w)/2))] w-[var(--w)] h-[calc(33%-5px)] mb-2 p-0 pb-0 border-[8px] border-neutral-900 rounded-4xl">
                <Curve
                    className="absolute -bottom-2 -left-10 w-8 h-8 rotate-0"
                    pathClassName="fill-neutral-900"
                />
                <Curve
                    className="absolute -bottom-2 -left-2 w-8 h-8 rotate-90"
                    pathClassName="fill-neutral-900"
                />
                <Curve
                    className="absolute -bottom-2 -right-10 w-8 h-8 rotate-90"
                    pathClassName="fill-neutral-900"
                />
                <Curve
                    className="absolute -bottom-2 -right-2 w-8 h-8 rotate-0"
                    pathClassName="fill-neutral-900"
                />
                <div className="relative w-full h-full ring-2 ring-neutral-900 bg-neutral-950/85 backdrop-blur-lg saturate-300 backdrop-brightness-200 rounded-[22px] overflow-clip">
                    {(questions && questionIndex !== -1) &&
                        <CardQuiz
                            question={(!questions || questionIndex === -1) ? null : questions[questionIndex]}
                            selectChoice={(!questions || questionIndex === -1) ? null : selectChoice}
                            pauseInterval={() => setIntervalState("STOP")}
                            startInterval={() => setIntervalState("CONT")}
                        />
                    }
                </div>
            </div>
        </div>
    )
}