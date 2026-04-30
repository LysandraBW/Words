import Button from "@/components/Button";
import { DeckGradedType } from "@/services/server/deckGraded";
import { TrashIcon, XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { DeckExtendedType, shuffleCards } from "./shuffleCards";
import Progress from "@/app/deck/Progress";
import Question from "@/app/deck/Question";


interface QuizGradedProps {
    deckGraded: DeckGradedType;
    onClose: () => void;
    onDelete: () => void;
}


export default function QuizGraded(props: QuizGradedProps) {
    const [index, setIndex] = useState(0);
    const [choices, setChoices] = useState<{[index: number]: number}>({});
    const [shuffledCards, setShuffledCards] = useState<DeckExtendedType>();
   

    useEffect(() => {
        setShuffledCards(shuffleCards(props.deckGraded));
    }, [props.deckGraded]);

    
    useEffect(() => {
        const choices: {[index: number]: number} = {};
        for (let i = 0; i < props.deckGraded.deck_questions.length; i++) {
            const question = props.deckGraded.deck_questions[i];
            choices[i] = question.choice;
        }
        setChoices(choices);
    }, [props.deckGraded]);


    if (!props.deckGraded || !shuffledCards)
        return <></>


    return (
        <div
            className="bg-purple-500"
        >
            <XIcon
                onClick={props.onClose}
            />
            <TrashIcon
                onClick={props.onDelete}
            />
            <h3>Quiz</h3>
            <div>
                Duration: {props.deckGraded.duration}
                Number Correct: {props.deckGraded.number_correct}
                Number Incorrect: {props.deckGraded.number_incorrect}
            </div>
            <Progress
                numberQuestions={props.deckGraded.deck_questions.length}
                index={index}
                onClickIndex={(i: number) => setIndex(i)}
                choices={choices}
            />
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
            <Button
                label="Next"
                disabled={index === shuffledCards.deck_questions.length - 1}
                onClick={() => setIndex(index + 1)}
            />
        </div>
    )
}