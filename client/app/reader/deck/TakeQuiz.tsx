import { DeckExtendedType, shuffleCards } from "@/app/reader/deck/shuffleCards";
import { DeckType } from "@/services/server/deck";
import { DeckGradedQuestionType, DeckGradedType, insertDeckGraded } from "@/services/server/deckGraded";
import clsx from "clsx";
import { CheckIcon, PauseIcon, PlayIcon, TriangleIcon, XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useStopwatch } from "react-timer-hook";


interface TakeQuizProps {
    deck: DeckType;
    deckGraded?: DeckGradedType | null;
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
        if (!props.deckGraded)
            return;

        const choices: {[index: number]: number} = {};
        for (let i = 0; i < props.deckGraded.deck_questions.length; i++) {
            const deckQuestion = props.deckGraded.deck_questions[i];
            choices[i] = deckQuestion.choice;
        }
    }, [props.deckGraded]);


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

    const question = shuffledDeck.deck_questions[index]
    const choice = choices[index]

    const word = question.words.find(word => word[2] === 0);
    if (!word)
        return <></>;

    return (
        <div className="h-full flex flex-col border- border-neutral-800 overflow-hidden">
            <div className="p-2 pb-4 px-4 pt-0 flex gap-x-2 bg-neutral-900 border-b border-neutral-800">
                <div className="h-6 p-1 grow flex gap-x-1 border border-neutral-700 rounded-md">
                    {[...Array(props.deck.deck_questions.length)].map((q, i) => {
                        const unanswered = choices[i] == null;
                        const correct = (!unanswered && choices[i] === 0);
                        const incorrect = !unanswered && !correct;
                        
                        return (
                            <div
                                key={i}
                                className={clsx(
                                    "relative w-full h-full bg-neutral-800 first:rounded-l-[3px] last:rounded-r-[3px] border border-neutral-700 shadow-sm",
                                    correct && "!bg-gradient-to-b !border-green-600 from-green-600 to-green-600 after:absolute ",
                                    incorrect && "!bg-gradient-to-b !border-red-500 from-red-500 to-red-500 after:absolute ",
                                    unanswered && "!bg-gradient-to-b !border-neutral-700 from-neutral-800 to-neutral-800 ",
                                )}
                            >

                            </div>
                        )
                    })}
                </div>
                <span className="tabular-nums text-xs text-neutral-500 bg-neutral-800 border border-neutral-700 h-6 flex justify-center items-center  px-2 rounded-md font-medium">
                    {hours}:
                    {minutes.toString().padStart(2, "0")}:
                    {seconds.toString().padStart(2, "0")}:
                    {milliseconds.toString().padStart(3, "0")}
                </span>
                <button 
                    onClick={() => {
                        if (paused)
                            start();
                        else
                            pause();
                        setPaused(!paused);
                    }}
                    className="w-[24px] aspect-square flex items-center justify-center bg-neutral-800 border border-neutral-700 rounded-md shadow-sm"
                >
                    {!paused ?
                        <PauseIcon
                            size={14}
                            strokeWidth={1.5}
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
                {(!props.deckGraded && Object.keys(choices).length === props.deck.deck_questions.length) &&
                    <button 
                        onClick={() => onFinishQuiz(choices, totalMilliseconds)}
                        className="h-[24px] px-2 flex justify-center items-center bg-blue-500 rounded-md shadow"
                    >
                        <span className="text-xs text-neutral-100 font-medium">
                            Finish
                        </span>
                    </button>
                }
            </div>
            <div className="w-full p-5 grow flex flex-col self-center overflow-auto">
                <div className="w-full grow grid grid-rows-[40%_1fr] gap-y-5">
                    <div className="w-full grid grid-cols-[auto_1fr_auto] gap-x-4">
                        <button 
                            disabled={index === 0} 
                            onClick={() => setIndex(index - 1)}
                            className="p-2 flex justify-center items-center gap-x-1 bg-neutral-900 border border-neutral-800 rounded-lg shadow"
                        >
                            <TriangleIcon
                                size={12}
                                strokeWidth={1.5}
                                className="fill-blue-600 stroke-blue-600 rotate-270"
                            />
                        </button>
                        <div className="relative bg-red-500- p-3 bg-neutral-900 border border-neutral-800 shadow flex justify-center items-center rounded-lg">
                            <span className="absolute left-1.5 top-1.5 px-1.5 py-0.5 bg-blue-600/10 rounded-md text-xs text-blue-500 font-medium tracking-wide">
                                {index+1} of {shuffledDeck.deck_questions.length}
                            </span>
                            <span className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 bg-blue-600/10 rounded-md text-xs text-blue-500 font-medium tracking-wide">
                                Select the Matching Definition
                            </span>
                            <span className="max-w-[320px] text-3xl text-shadow-lg text-neutral-200 text-center tracking-wide font-medium">
                                {word[0]}
                            </span>
                        </div>
                        <button
                            disabled={index === props.deck.deck_questions.length - 1} 
                            onClick={() => setIndex(index + 1)}
                            className="p-2 flex justify-center items-center gap-x-1 bg-neutral-900 border border-neutral-800 rounded-lg shadow"
                        >
                            <TriangleIcon
                                size={12}
                                strokeWidth={1.5}
                                className="fill-blue-600 stroke-blue-600 rotate-90"
                            />
                        </button>
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
                                        "bg-neutral-900 border border-neutral-800 shadow rounded-xl",
                                        "hover:scale-97 transition-all",
                                        answered && "!cursor-default" ,
                                        selected && "!border-blue-500"
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
                                            (answered && correct) && "!bg-green-600 !border-green-600",
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
                                        <span className="block text-base text-neutral-400 tracking-wide max-w-sm">
                                            {shuffledWordDef}
                                        </span>
                                    </div>
                                </button>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}