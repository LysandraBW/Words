import Button from "@/components/Button";
import { DeckGradedQuestionType, insertDeckGraded } from "@/services/server/deckGraded";
import { useEffect, useState } from "react";
import { useStopwatch } from "react-timer-hook";
import { DeckExtendedType, shuffleCards } from "./shuffleCards";
import Progress from "@/app/deck/Progress";
import Question from "@/app/deck/Question";
import { DeckType } from "@/services/server/deck";


interface QuizProps {
    deck: DeckType;
    onClose: () => void;
    onQuizFinished: (deck: Awaited<ReturnType<typeof insertDeckGraded>>) => void;
}


export default function Quiz(props: QuizProps) {
    const [index, setIndex] = useState(0);
    const [choices, setChoices] = useState<{[index: number]: number}>({});
    const [shuffledCards, setShuffledCards] = useState<DeckExtendedType>();


    const {
        start, pause,
        hours, minutes, seconds, milliseconds,
        totalMilliseconds
    } = useStopwatch({ autoStart: false, interval: 20 });
    

    useEffect(() => {
        setShuffledCards(shuffleCards(props.deck));
    }, [props.deck]);


    useEffect(() => {
        if (!shuffledCards?.deck_questions.length)
            return;
        start();
    }, [shuffledCards]);


    if (!props.deck.deck_questions.length || !shuffledCards)
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
    const notAnswered = shuffledCards && choices[index] == null;
    const lastCard = shuffledCards && index === shuffledCards.deck_questions.length - 1;


    return (
        <div>
            <h3>Quiz</h3>
            <Progress
                numberQuestions={props.deck.deck_questions.length}
                index={index}
                onClickIndex={(i: number) => setIndex(i)}
                choices={choices}
            />
            <div>
                <span className="tabular-nums">
                    {hours}:
                    {minutes.toString().padStart(2, "0")}:
                    {seconds.toString().padStart(2, "0")}:
                    {milliseconds.toString().padStart(2, "0")}
                </span>
            </div>
            <Question
                question={shuffledCards.deck_questions[index]}
                choice={choices[index]}
                onSelectChoice={(choice: number) => setChoices({...choices, [index]: choice})}
            />
            <Button
                label="Back"
                disabled={index === 0}
                onClick={() => setIndex(index - 1)}
            />
            {lastCard ?
                <Button
                    label="Finish"
                    disabled={notComplete}
                    onClick={() => onFinishQuiz(choices, totalMilliseconds)}
                />
                :
                <Button
                    label="Next"
                    disabled={notAnswered}
                    onClick={() => setIndex(index + 1)}
                />
            }
        </div>
    )
}