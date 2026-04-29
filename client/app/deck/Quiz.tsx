import Button from "@/components/Button";
import { DeckCardType } from "@/services/server/deck";
import { insertDeckGraded } from "@/services/server/deckGraded";
import { useEffect, useState } from "react";
import { useStopwatch } from "react-timer-hook";
import { DeckCardExtendedType, shuffleCards } from "./shuffleCards";
import Progress from "@/app/deck/Progress";
import Question from "@/app/deck/Question";


interface QuizProps {
    cards: DeckCardType[];
    onQuizFinished: (deck: Awaited<ReturnType<typeof insertDeckGraded>>) => void;
}


export default function Quiz(props: QuizProps) {
    const [index, setIndex] = useState(0);
    const [choices, setChoices] = useState<{[index: number]: number}>({});
    const [shuffledCards, setShuffledCards] = useState<DeckCardExtendedType[]>();


    const {
        start, pause,
        hours, minutes, seconds, milliseconds,
        totalMilliseconds
    } = useStopwatch({ autoStart: false, interval: 20 });
    

    useEffect(() => {
        setShuffledCards(shuffleCards(props.cards));
    }, [props.cards]);


    useEffect(() => {
        if (!shuffledCards?.length)
            return;
        start();
    }, [shuffledCards]);


    const selectChoice = (index: number, choice: number) => {
        const deckCardID = props.cards[index].deck_card_id;
        const updatedChoices = {
            ...choices,
            [deckCardID]: choice
        }
        setChoices(updatedChoices);

        // Stop the Timer
        // If the user has answered all the questions (cards),
        // we stop the timer.
        const isComplete = Object.values(updatedChoices).length === props.cards.length;
        if (isComplete)
            pause();
    }

    
    const onFinishQuiz = async (choices: {[index: number]: number}, duration: number) => {
        try {
            if (Object.values(choices).length !== props.cards.length)
                throw new Error('Must Answer All Questions');

            // Flatten Choices
            const flatChoices = Object.entries(choices).map(choice => {
                return [Number(choice[0]), Number(choice[1])]
            }) as [number, number][];

            // Find # Correct and # Incorrect
            const choiceValues = props.cards.map(card => choices[card.deck_card_id]);
            const numberCorrect = choiceValues.reduce((total, value) => value === 0 ? total + 1 : total, 0);
            const numberIncorrect = choiceValues.length - numberCorrect;

            const output = await insertDeckGraded({
                deck_id: props.cards[0].deck_id,
                duration: duration,
                number_correct: numberCorrect,
                number_incorrect: numberIncorrect,
            }, flatChoices);

            props.onQuizFinished(output);
        }
        catch (err) {
            alert(err);
        }
    }


    if (!props.cards.length || !shuffledCards)
        return <></>


    const notComplete = Object.values(choices).length !== props.cards.length;
    const notAnswered = shuffledCards && choices[shuffledCards[index].deck_card_id] == null;
    const lastCard = shuffledCards && index === shuffledCards.length - 1;


    return (
        <div>
            <h3>Quiz</h3>
            <Progress
                cards={props.cards}
                shuffledCards={shuffledCards}
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
                card={props.cards[index]}
                shuffledCard={shuffledCards[index]}
                choices={choices}
                selectChoice={(choice: number) => selectChoice(index, choice)}
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