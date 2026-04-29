import Button from "@/components/Button";
import { DeckCardType } from "@/services/server/deck";
import { DeckGradedType, DeckGradedCardType, insertDeckGraded } from "@/services/server/deckGraded";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { useStopwatch } from "react-timer-hook";

interface QuizProps {
    deckCards: DeckCardType[];
    onQuizFinished: (deckGraded: DeckGradedType, deckCardGraded: DeckGradedCardType[]) => void;
}

interface DeckCardExtendedType extends Omit<DeckCardType, "words"> {
    // We add a number in order to keep
    // track of the numbering as we shuffle
    // the words.
    words: [string, string, number][];
}

const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);

export default function Quiz(props: QuizProps) {
    const [index, setIndex] = useState(0);
    const [shuffledCards, setShuffledCards] = useState<DeckCardExtendedType[]>([]);
    const [choices, setChoices] = useState<{[questionIndex: number]: number}>({});
    
    const {
        start,
        pause,
        hours,
        minutes,
        seconds,
        milliseconds,
        totalMilliseconds
    } = useStopwatch({ autoStart: false, interval: 20 });
    

    useEffect(() => {
        setShuffledCards(loadShuffleCards(props.deckCards));
    }, [props.deckCards]);


    useEffect(() => {
        if (!shuffledCards.length)
            return;
        start();
    }, [shuffledCards]);


    const loadShuffleCards = (deckCards: DeckCardType[]): DeckCardExtendedType[] => {
        const deckCardsExtended = [];

        for (const card of deckCards) {
            const shuffledIndices = [...Array(card.words.length)].map((e, i) => i);
            shuffledIndices.sort(() => Math.random() - 0.5);

            const shuffledWords: [string, string, number][] = [];
            for (let i = 0; i < card.words.length; i++) {
                const shuffledIndex = shuffledIndices[i];
                shuffledWords.push([
                    card.words[shuffledIndex][0], 
                    card.words[shuffledIndex][1], 
                    shuffledIndex
                ]);
            }

            deckCardsExtended.push({
                ...card,
                words: shuffledWords
            });
        }

        return deckCardsExtended;
    }


    const selectChoice = (index: number, choice: number) => {
        const deckCard = props.deckCards[index];
        const updatedChoices = {
            ...choices,
            [deckCard.deck_card_id]: choice
        }
        setChoices(updatedChoices);

        // Stop the Timer
        if (Object.values(updatedChoices).length === props.deckCards.length) {
            pause();
        }
    }


    const onFinishQuiz = async (choices: {[index: number]: number}, duration: number) => {
        const choiceValues = props.deckCards.map(deckCard => choices[deckCard.deck_card_id]);
        const numberCorrect = choiceValues.reduce((accumulator, currentValue) => currentValue === 0 ? accumulator + 1 : accumulator, 0);
        const numberIncorrect = choiceValues.length - numberCorrect;

        const createdGradedDeck = await insertDeckGraded({
            deck_graded_id: -1,
            deck_id: props.deckCards[0].deck_id,
            number_correct: numberCorrect,
            number_incorrect: numberIncorrect,
            duration: duration
        }, Object.entries(choices).map(choice => [Number(choice[0]), Number(choice[1])]));

        if (!createdGradedDeck) {
            alert('Failed to Create Graded Deck');
            return;
        }

        console.log(createdGradedDeck);
        props.onQuizFinished(createdGradedDeck.deckGraded, createdGradedDeck.deckGradedCard);
    }


    if (props.deckCards.length <= 0)
        return <></>


    return (
        <div>
            <h3>Quiz</h3>
            {shuffledCards.length && [...Array(props.deckCards.length)].map((e, i) => (
                <button 
                    key={i}
                    onClick={() => setIndex(i)}
                    className={clsx(
                        "p-2 bg-black text-white",
                        index === i && "bg-blue-500",
                        choices[shuffledCards[i].deck_card_id] != null && (choices[shuffledCards[i].deck_card_id] === 0 ? "bg-green-500" : "bg-red-500"),
                        choices[shuffledCards[i].deck_card_id] == null && "bg-gray-500"
                    )}
                >
                    {i}
                </button>
            ))}
            {JSON.stringify(choices)}
            {JSON.stringify(shuffledCards)}
            <div>
                <span className="tabular-nums">{hours}:{minutes.toString().padStart(2, "0")}:{seconds.toString().padStart(2, "0")}:{milliseconds.toString().padStart(2, "0")}</span>
            </div>
            {shuffledCards.length &&
                <>
                    <p>Select the Definition of Word: <b>{props.deckCards[index].words[0][0]}</b></p>
                    <div
                        className="grid grid-cols-2 grid-rows-2 gap-2"
                    >
                        {shuffledCards[index].words.map(([word, wordDefinition, wordIndex], i) => (
                            <button
                                key={i}
                                className={clsx(
                                    "border",
                                    (choices[shuffledCards[index].deck_card_id] != null && wordIndex === 0) && "bg-green-500",
                                    (choices[shuffledCards[index].deck_card_id] != null && wordIndex !== 0) && "bg-red-500",
                                    choices[shuffledCards[index].deck_card_id] === wordIndex && "border-2 border-blue-500"
                                )}
                                onClick={() => {
                                    if (choices[shuffledCards[index].deck_card_id] != null)
                                        return;
                                    selectChoice(index, wordIndex)
                                }}
                            >
                                <div>
                                    {wordDefinition}
                                </div>
                            </button>
                        ))}
                    </div>
                </>
            }
            {shuffledCards.length &&
                <>
                    <Button
                        label="Back"
                        disabled={index === 0}
                        onClick={() => setIndex(index - 1)}
                    />
                    {index === shuffledCards.length - 1 || choices[shuffledCards[index].deck_card_id] == null ?
                        <Button
                            label="Finish"
                            disabled={Object.values(choices).length !== props.deckCards.length}
                            onClick={() => {
                                if (Object.values(choices).length !== props.deckCards.length) {
                                    alert('Must Answer All Questions');
                                    return;
                                }
                                onFinishQuiz(choices, totalMilliseconds);
                            }}
                        />
                        :
                        <Button
                            label="Next"
                            disabled={index === shuffledCards.length - 1 || choices[shuffledCards[index].deck_card_id] == null}
                            onClick={() => setIndex(index + 1)}
                        />
                    }
                </>
            }
        </div>
    )
}