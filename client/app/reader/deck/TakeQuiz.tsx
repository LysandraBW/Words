import { DeckExtendedType, shuffleCards } from "@/app/deck/shuffleCards";
import { DeckType } from "@/services/server/deck";
import { DeckGradedQuestionType, insertDeckGraded } from "@/services/server/deckGraded";
import clsx from "clsx";
import { CheckIcon, ExpandIcon, MoveLeftIcon, MoveRightIcon, PauseIcon, PlayIcon, XIcon } from "lucide-react";
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
    const [paused, setPaused] = useState(false);


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


    // 
    const notComplete = Object.values(choices).length !== props.deck.deck_questions.length;
    const notAnswered = shuffledDeck && choices[index] == null;
    const lastCard = shuffledDeck && index === shuffledDeck.deck_questions.length - 1;

    
    // 
    const question = shuffledDeck.deck_questions[index]
    const choice = choices[index]

    const word = question.words.find(word => word[2] === 0);
    if (!word)
        return <></>;

    return (
        <div className="h-full flex flex-col border-t border-neutral-800 overflow-hidden">
            <div className="p-2 flex gap-x-2 bg-neutral-900 border-b border-neutral-800">
                <span className="tabular-nums text-xs bg-neutral-800 border border-neutral-700 h-6 flex justify-center items-center  px-2 rounded-md font-medium">
                    {hours}:
                    {minutes.toString().padStart(2, "0")}:
                    {seconds.toString().padStart(2, "0")}:
                    {milliseconds.toString().padStart(3, "0")}
                </span>
                <button className="w-[24px] aspect-square flex items-center justify-center bg-neutral-800 border border-neutral-700/50 rounded-md shadow-sm">
                    {!paused ?
                        <PauseIcon
                            size={14}
                            strokeWidth={2}
                            className="stroke-neutral-500"
                        />
                        :
                        <PlayIcon
                            size={14}
                            strokeWidth={2}
                            className="stroke-neutral-500"
                        />
                    }
                </button>
                <div className="h-6 p-1 grow flex gap-x-1 border border-neutral-700 rounded-xl">
                    {[...Array(5)].map((q, i) => {
                        const unanswered = choices[i] == null;
                        const correct = (!unanswered && choices[i] === 0);
                        const incorrect = !unanswered && !correct;
                        
                        return (
                            <div
                                key={i}
                                className={clsx(
                                    "relative w-full h-full bg-neutral-800 first:rounded-l-lg last:rounded-r-lg border border-neutral-700",
                                    correct && "!bg-gradient-to-b !border-green-400 from-green-600 to-green-600 after:absolute ",
                                    incorrect && "!bg-gradient-to-b !border-red-400 from-red-500 to-red-500 after:absolute ",
                                    unanswered && "!bg-gradient-to-b !border-neutral-700 from-neutral-800 to-neutral-800 ",
                                )}
                            >

                            </div>
                        )
                    })}
                </div>
                <button className="w-[24px] aspect-square flex items-center justify-center bg-neutral-800 border border-neutral-700/50 rounded-md shadow-sm">
                    <ExpandIcon
                        size={14}
                        strokeWidth={2}
                        className="stroke-neutral-500"
                    />
                </button>
                <button className="w-[24px] aspect-square flex items-center justify-center bg-neutral-800 border border-neutral-700/50 rounded-md shadow-sm">
                    <XIcon
                        size={14}
                        strokeWidth={2}
                        className="stroke-neutral-500"
                    />
                </button>
            </div>
            <div className="w-full p-5 grow flex flex-col bg-yellow-500- self-center overflow-auto">
                <div className="grow grid grid-rows-[25%_1fr] gap-y-5">
                    <div className="relative bg-red-500- p-3 bg-neutral-900 border border-neutral-800 shadow flex justify-center items-center rounded-2xl">
                        <span className="absolute left-1.5 top-1.5 px-1.5 py-0.5 bg-neutral-700/50 border border-neutral-600/50 rounded-lg shadow text-xs text-neutral-400/50 font-medium tracking-wide">
                            Question {index+1} of {shuffledDeck.deck_questions.length}
                        </span>
                        <span className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 bg-neutral-700/50 border border-neutral-600/50 rounded-lg shadow text-xs text-neutral-400/50 font-medium tracking-wide">
                            Select the Matching Definition
                        </span>
                        <span className="max-w-[320px] text-2xl text-shadow text-neutral-200 text-center tracking-wide font-semibold">
                            {word[0]}
                        </span>
                    </div>
                    <div className="grid grid-cols-2 grid-rows-2 gap-5">
                        {question.words.map(([shuffledWord, shuffledWordDef, originalIndex], i) => {
                            const answered = choice != null;
                            const correct = answered && originalIndex === 0;
                            const incorrect = answered && originalIndex !== 0;
                            const selected = choice === originalIndex;
        
                            return (
                                <button
                                    key={i}
                                    className={clsx(
                                        "p-3 grid grid-cols-[auto_1fr] gap-x-4",
                                        "bg-neutral-900 border border-neutral-800 shadow rounded-2xl",
                                        "hover:scale-97 transition-all",
                                        answered && "!cursor-default" ,
                                        // correct && "bg-green-500",
                                        // incorrect && "bg-red-500",
                                        // selected && "border-2 border-blue-500"
                                    )}
                                    onClick={() => {
                                        // No Function or Already Answered
                                        if (choice != null)
                                            return;
                                        selectChoice(index, originalIndex)
                                    }}
                                >
                                    <div 
                                        className={clsx(
                                            "w-4 h-4 flex justify-center items-center bg-neutral-800 border border-neutral-700 rounded-full shadow",
                                            (answered && correct) && "!bg-blue-500 !border-blue-500",
                                            (answered && incorrect) && "!bg-red-500 !border-red-500",
                                        )}
                                    >
                                        {(answered && correct) &&
                                            <CheckIcon
                                                size={8}
                                                strokeWidth={4}
                                                className="stroke-neutral-200"
                                            />
                                        }
                                        {(answered && incorrect) &&
                                            <XIcon
                                                size={8}
                                                strokeWidth={4}
                                                className="relative top-[-0.5px] left-[0.0px] stroke-neutral-200"
                                            />
                                        }
                                    </div>
                                    <div className="w-full h-full flex items-center justify-center overflow-hidden">
                                        <span className="block text-lg text-neutral-400 tracking-wide max-w-sm">
                                            {shuffledWordDef}
                                        </span>
                                    </div>
                                </button>
                            )
                        })}
                    </div>
                </div>
            </div>
            <div className="w-full p-2 grid grid-cols-2 gap-x-2 bg-neutral-900/50 border-t border-neutral-800">
                <button className="flex justify-center items-center bg-neutral-800 border border-neutral-700 rounded-lg shadow">
                    <MoveLeftIcon
                        size={18}
                        strokeWidth={1.5}
                        className="stroke-neutral-500"
                    />
                </button>
                <button className="flex justify-center items-center bg-neutral-800 border border-neutral-700 rounded-lg shadow">
                    <MoveRightIcon
                        size={18}
                        strokeWidth={1.5}
                        className="stroke-neutral-500"
                    />
                </button>
            </div>
        </div>
    )
}