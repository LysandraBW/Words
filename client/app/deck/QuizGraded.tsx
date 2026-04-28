import Button from "@/components/Button";
import { createDeckGraded, DeckCardGradedType, DeckCardType, DeckGradedType } from "@/services/db/deck"
import clsx from "clsx";
import { TrashIcon, XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useStopwatch } from "react-timer-hook";

interface QuizGradedProps {
    deckGraded: DeckGradedType;
    deckCards: DeckCardType[];
    deckGradedCards: DeckCardGradedType[];
    onClose: () => void;
    onDelete: () => void;
}

interface DeckCardExtendedType extends Omit<DeckCardType, "words"> {
    // We add a number in order to keep
    // track of the numbering as we shuffle
    // the words.
    words: [string, string, number][];
}

export default function QuizGraded(props: QuizGradedProps) {
    const [index, setIndex] = useState(0);
    const [shuffledCards, setShuffledCards] = useState<DeckCardExtendedType[]>([]);
    const [choices, setChoices] = useState<{[questionIndex: number]: number}>({});
   

    useEffect(() => {
        setShuffledCards(loadShuffleCards(props.deckCards));
    }, [props.deckCards]);

    
    useEffect(() => {
        if (!props.deckGradedCards)
            return;
        const choices: {[questionIndex: number]: number} = {};
        for (const card of props.deckGradedCards) {
            choices[card.deck_card_id] = card.choice;
        }
        setChoices(choices);
    }, [props.deckGradedCards]);


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


    if (props.deckCards.length <= 0)
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
                Duration: {props.deckGraded.duration}
                Number Correct: {props.deckGraded.number_correct}
                Number Incorrect: {props.deckGraded.number_incorrect}
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
                    <Button
                        label="Next"
                        disabled={index === shuffledCards.length - 1 || choices[shuffledCards[index].deck_card_id] == null}
                        onClick={() => setIndex(index + 1)}
                    />
                </>
            }
        </div>
    )
}