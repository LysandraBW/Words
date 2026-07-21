import { DeckExtendedType, shuffleCards } from "@/app/deck/shuffleCards";
import { DeckType } from "@/services/server/deck";
import { DeckGradedQuestionType, insertDeckGraded } from "@/services/server/deckGraded";
import clsx from "clsx";
import { XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useStopwatch } from "react-timer-hook";

interface TakeQuizProps {
    deck: DeckType;
    onClose: () => void;
    onQuizFinished: (deck: Awaited<ReturnType<typeof insertDeckGraded>>) => void;
}


export default function TakeQuiz(props: TakeQuizProps) {
    const [index, setIndex] = useState(0);
    const [choices, setChoices] = useState<{[index: number]: number}>({});
    const [shuffledDeck, setShuffledDeck] = useState<DeckExtendedType>();


    const {
        start, pause,
        hours, minutes, seconds, milliseconds,
        totalMilliseconds
    } = useStopwatch({ autoStart: false, interval: 20 });
    

    useEffect(() => {
        const shuffledDeck = shuffleCards(props.deck);
        setShuffledDeck(shuffledDeck);
    }, [props.deck]);


    useEffect(() => {
        if (!shuffledDeck?.deck_questions.length)
            return;
        start();
    }, [shuffledDeck]);


    if (!props.deck.deck_questions.length || !shuffledDeck)
        return <></>;


    const selectChoice = (index: number, choice: number) => {
        const updatedChoices = {
            ...choices,
            [index]: choice
        }
        setChoices(updatedChoices);

        // Stop the Timer
        // If the user has answered all the questions (cards),
        // we stop the timer.
        const numAnswered = Object.values(updatedChoices).length;
        const numQuestions = props.deck.deck_questions.length;
        const isComplete = numAnswered === numQuestions;
        if (isComplete)
            pause();
    }

    
    const onFinishQuiz = async (choices: {[index: number]: number}, duration: number) => {
        try {
            const numAnswered = Object.values(choices).length;
            const numQuestions = props.deck.deck_questions.length;
            if (numAnswered !== numQuestions)
                throw new Error('Must Answer All Questions');
            
            
            const deckQuestions: DeckGradedQuestionType[] = props.deck.deck_questions.map((question, i) => {
                return {
                    ...question,
                    choice: choices[i]
                };
            });

            // Find # Correct and # Incorrect
            const numberCorrect = deckQuestions.reduce((total, value) => value.choice === 0 ? total + 1 : total, 0);
            const numberIncorrect = deckQuestions.length - numberCorrect;

            const output = await insertDeckGraded({
                deck_id: props.deck.deck_id,
                duration: duration,
                number_correct: numberCorrect,
                number_incorrect: numberIncorrect,
                deck_questions: deckQuestions
            });

            props.onQuizFinished(output);
        }
        catch (err) {
            alert(err);
        }
    }


    const notComplete = Object.values(choices).length !== props.deck.deck_questions.length;
    const notAnswered = shuffledDeck && choices[index] == null;
    const lastCard = shuffledDeck && index === shuffledDeck.deck_questions.length - 1;

    
    return (
        <div className="h-full flex flex-col border-t border-neutral-800">
            <div className="p-2 flex gap-x-2">
                <span className="tabular-nums text-xs bg-neutral-800 border border-neutral-700 h-6 flex justify-center items-center  px-2 rounded-md font-medium">
                    {hours}:
                    {minutes.toString().padStart(2, "0")}:
                    {seconds.toString().padStart(2, "0")}:
                    {milliseconds.toString().padStart(3, "0")}
                </span>
                <div className="h-6 grow flex">
                    {[...Array(20)].map((q, i) => {
                        const unanswered = choices[i] == null;
                        const correct = true || (!unanswered && choices[i] === 0);
                        const incorrect = !unanswered && !correct;
                        
                        return (
                            <div
                                key={i}
                                className={clsx(
                                    "relative w-full h-full bg-neutral-800 first:rounded-l-md last:rounded-r-md border border-neutral-700 border-r-0 last:!border-r",
                                    correct && "!bg-gradient-to-b !border-green-700 from-green-500 to-green-500 after:absolute after:top-[2px] after:left-[2px] after:w-[calc(100%-4px)] after:h-[calc(100%-4px)] after:bg-green-400 after:border after:border-green-600 after:rounded-md",
                                    incorrect && "!bg-gradient-to-b !border-red-700 from-red-500 to-red-500 after:absolute after:top-[2px] after:left-[2px] after:w-[calc(100%-4px)] after:h-[calc(100%-4px)] after:bg-red-400/50 after:border after:border-red-600 after:rounded-md",
                                    unanswered && "!bg-gradient-to-b !border-neutral-700 from-neutral-800 to-neutral-800 after:absolute after:top-[2px] after:left-[2px] after:w-[calc(100%-4px)] after:h-[calc(100%-4px)] after:bg-neutral-700 after:border after:border-neutral-900/85 after:shadow-sm after:shadow-black/25 after:rounded-md",
                                )}
                            >

                            </div>
                        )
                    })}
                </div>
                <button className="w-[24px] aspect-square flex items-center justify-center bg-neutral-800 border border-neutral-700/50 rounded-md shadow-sm">
                    <XIcon
                        size={14}
                        strokeWidth={2}
                        className="stroke-neutral-500"
                    />
                </button>
            </div>
            <div className="grow grid grid-rows-2">
               <div className="bg-red-500">
                </div>
                <div className="grid grid-cols-2 grid-rows-2">
                    <div className="bg-blue-500">
                    </div>
                    <div className="bg-blue-400">
                    </div>
                    <div className="bg-blue-200">
                    </div>
                    <div className="bg-blue-800">
                    </div>
                </div>
            </div>
        </div>
    )
}