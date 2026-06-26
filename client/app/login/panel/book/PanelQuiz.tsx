import { Fragment } from "react/jsx-runtime";
import { books } from "../../books";
import CardQuiz from "./CardQuiz";
import MovingRow from "./MovingRow";
import { useEffect, useState } from "react";
import Curve from "./Curve";
import { shuffle } from "@/utilities/array";


export interface Question {
    label: string;
    options: string[];
    correctOptionIndex: number;
    selectedOptionIndex: number;
}


export default function PanelQuiz() {
    const [questions, setQuestions] = useState<Question[]>();
    const [questionIndex, setQuestionIndex] = useState(-1);


    useEffect(() => {
        const questions: Question[] = [];
        for (const book of books) {
            const optionIndices = new Set<number>();
            while (optionIndices.size < 3) {
                const optionIndex = Math.round(Math.random() * (books.length - 1));
                if (optionIndices.has(optionIndex))
                    continue;
                optionIndices.add(optionIndex);
            }
            const options = [...optionIndices].map((i: number) => books[i].word);
            const correctOptionIndex = Math.round(Math.random() * 3);
            options.splice(correctOptionIndex, 0, book.word);

            questions.push({
                label: book.definition,
                options: options,
                correctOptionIndex: correctOptionIndex,
                selectedOptionIndex: -1
            });
        }
        
        setQuestions(questions);
        setQuestionIndex(0);
    }, []);


    // useEffect(() => {
    //     const id = setInterval(() => {
    //         if (!questions)
    //             return;
    //         // Source - https://stackoverflow.com/a/1527834
    //         // Posted by Darin Dimitrov
    //         // Retrieved 2026-05-11, License - CC BY-SA 2.5
    //         const n = Math.floor(Math.random() * (questions.length - 1));
    //         setQuestionIndex(n);
    //     }, 15 * 1000);
    //     return () => clearInterval(id);
    // }, [questions?.length]);

    
    const selectChoice = (choiceIndex: number) => {
        if (!questions)
            return;
        const updatedQuestions = [...questions].map((e, i) => i === questionIndex ? {...e, selectedOptionIndex: choiceIndex} : e);
        setQuestions(updatedQuestions);
    }


    const prevQuestion = () => {
        if (!questions)
            return;
        setQuestionIndex(questionIndex === questions.length - 1 ? questions.length - 1 : questionIndex - 1);
    }


    const nextQuestion = () => {
        if (!questions)
            return;

        const nextQuestionIndex = (questionIndex + 1) % questions.length;
        setQuestionIndex(nextQuestionIndex);
    }


    return (
        <div className="sticky top-0 max-lg:hidden relative w-full h-full p-2 bg-neutral-800 rounded-4xl">
            <div className="absolute top-0 right-0 z-100 w-[calc(50%-12px)] h-[calc(45%-5px)] mr-2 mt-2 flex flex-col items-center justify-center gap-y-4 bg-neutral-800 rounded-bl-4xl rounded-tr-2xl">
                <Curve
                    className="absolute top-0 -left-6 w-6 h-6 rotate-270"
                    pathClassName="fill-neutral-800"
                />
                <Curve
                    className="absolute -bottom-6 right-0 w-6 h-6 rotate-270"
                    pathClassName="fill-neutral-800"
                />
                <div className="relative w-full h-full rounded-tr-3xl rounded-bl-3xl overflow-clip">
                    {/* Needs Something */}
                </div>
            </div>
            <div className="relative w-full h-full p-2 flex flex-col gap-y-2 bg-neutral-900 rounded-3xl overflow-clip cursor-[url('/images/handpointing.svg'),_pointer]">
                {[...Array(3)].map((e, i) => (
                    <Fragment key={i}>
                        <MovingRow
                            rows={3}
                            cols={6}
                            books={books.slice(i*26, (i+1)*26)}
                            reverse={i % 2 === 0}
                        />
                    </Fragment>
                ))}
            </div>
            <div className="absolute bottom-0 left-0 w-[calc(50%-12px)] h-[calc(33%-5px)] ml-2 mb-2 p-2 pb-0 pl-0 bg-neutral-800 rounded-tr-4xl rounded-bl-2xl">
                <Curve
                    className="absolute bottom-0 -right-6 w-6 h-6 rotate-90"
                    pathClassName="fill-neutral-800"
                />
                <Curve
                    className="absolute -top-6 left-0 w-6 h-6 rotate-90"
                    pathClassName="fill-neutral-800"
                />
                <div className="relative w-full h-full bg-neutral-100 rounded-3xl overflow-clip">
                    <CardQuiz
                        question={(!questions || questionIndex === -1) ? null : questions[questionIndex]}
                        selectChoice={(!questions || questionIndex === -1) ? null : selectChoice}
                        onPrevQuestion={prevQuestion}
                        onNextQuestion={nextQuestion}
                    />
                </div>
            </div>
        </div>
    )
}