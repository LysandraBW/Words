import Button from "@/components/Button";
import { DeckCardType } from "@/services/db/deck"
import clsx from "clsx";
import { useEffect, useState } from "react";

interface QuizProps {
    deckCards: DeckCardType[];
    onQuizFinished: () => void;
}

interface DeckCardExtendedType extends Omit<DeckCardType, "words"> {
    // This number represents the initial
    // numbering of the cards. I'm storing it
    // as they need to be shuffled.
    words: [string, string, number][];
}

export default function Quiz(props: QuizProps) {
    const [index, setIndex] = useState(0);
    const [shuffledCards, setShuffledCards] = useState<DeckCardExtendedType[]>([]);
    const [time, setTime] = useState(0);
    const [choices, setChoices] = useState<{[questionIndex: number]: number}>({});
    

    useEffect(() => {
        setShuffledCards(loadShuffleCards(props.deckCards));
    }, [props.deckCards]);


    useEffect(() => {
        if (!shuffledCards.length)
            return;

        const intervalID = setInterval(() => setTime(time + 1), 1);
        return () => clearInterval(intervalID);
    }, [shuffledCards, time]);


    const hours = Math.floor(time / 360000);
    const minutes = Math.floor((time % 360000) / 6000);
    const seconds = Math.floor((time % 6000) / 100);
    const milliseconds = time % 100;

    const loadShuffleCards = (deckCards: DeckCardType[]): DeckCardExtendedType[] => {
        const deckCardsExtended = [];

        for (const card of deckCards) {
            const shuffledIndices = [...Array(card.words.length)].map((e, i) => i);
            shuffledIndices.sort(() => Math.random() - 0.5);

            const shuffledWords: [string, string, number][] = [];
            for (let i = 0; i < card.words.length; i++) {
                const shuffledIndex = shuffledIndices[i];
                shuffledWords.push([card.words[shuffledIndex][0], card.words[shuffledIndex][1], shuffledIndex]);
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
        setChoices({...choices, [deckCard.deck_card_id]: choice});
    }

    const onFinishQuiz = (choices: {[index: number]: number}) => {

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
            <div
                className="grid grid-cols-2 grid-rows-2 gap-2"
            >
                {shuffledCards.length &&
                    <>
                        {shuffledCards[index].words.map(([word, wordDefinition, wordIndex], i) => (
                            <button
                                key={i}
                                className={clsx(
                                    "border",
                                    (choices[shuffledCards[index].deck_card_id] != null && wordIndex === 0) && "bg-green-500",
                                    (choices[shuffledCards[index].deck_card_id] != null && wordIndex !== 0) && "bg-red-500",
                                )}
                                onClick={() => {
                                    if (choices[shuffledCards[index].deck_card_id] != null)
                                        return;
                                    selectChoice(index, wordIndex)
                                }}
                            >
                                {choices[shuffledCards[index].deck_card_id] === wordIndex &&
                                    <div>
                                        Selected
                                    </div>
                                }
                                <div>
                                    <b>
                                        {word}
                                    </b>
                                </div>
                                <div>
                                    {wordDefinition}
                                </div>
                            </button>
                        ))}
                    </>
                }
                
            </div>
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
                            onClick={() => 1}
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