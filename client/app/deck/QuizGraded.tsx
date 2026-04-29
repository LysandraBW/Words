import Button from "@/components/Button";
import { DeckCardType } from "@/services/server/deck";
import { DeckGradedType, DeckGradedCardType } from "@/services/server/deckGraded";
import { TrashIcon, XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { DeckCardExtendedType, shuffleCards } from "./shuffleCards";
import Progress from "@/app/deck/Progress";
import Question from "@/app/deck/Question";


interface QuizGradedProps {
    deckCards: DeckCardType[];
    deckGraded: DeckGradedType;
    deckGradedCards: DeckGradedCardType[];
    onClose: () => void;
    onDelete: () => void;
}


export default function QuizGraded(props: QuizGradedProps) {
    const [index, setIndex] = useState(0);
    const [choices, setChoices] = useState<{[index: number]: number}>({});
    const [shuffledCards, setShuffledCards] = useState<DeckCardExtendedType[]>();
   

    useEffect(() => {
        setShuffledCards(shuffleCards(props.deckCards));
    }, [props.deckCards]);

    
    useEffect(() => {
        const choices: {[index: number]: number} = {};
        for (const card of props.deckGradedCards)
            choices[card.deck_card_id] = card.choice;
        setChoices(choices);
    }, [props.deckGradedCards]);


    if (!props.deckCards.length || !shuffledCards)
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
                cards={props.deckCards}
                shuffledCards={shuffledCards}
                index={index}
                onClickIndex={(i: number) => setIndex(i)}
                choices={choices}
            />
            <Question
                card={props.deckCards[index]}
                shuffledCard={shuffledCards[index]}
                choices={choices}
            />
            <Button
                label="Back"
                disabled={index === 0}
                onClick={() => setIndex(index - 1)}
            />
            <Button
                label="Next"
                disabled={index === shuffledCards.length - 1}
                onClick={() => setIndex(index + 1)}
            />
        </div>
    )
}