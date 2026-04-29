import { DeckCardExtendedType } from "@/app/deck/shuffleCards";
import { DeckCardType } from "@/services/server/deck";
import clsx from "clsx";


interface QuestionProps {
    card: DeckCardType;
    shuffledCard: DeckCardExtendedType;
    choices: {[index: number]: number};
    selectChoice?: (choice: number) => void;
}


export default function Question(props: QuestionProps) {
    const word = props.card.words[0][0];


    return (
        <div>
            <p>Select the Definition of Word: <b>{word}</b></p>
            <div className="grid grid-cols-2 grid-rows-2 gap-2">
                {props.shuffledCard.words.map(([shuffledWord, shuffledWordDef, originalIndex], i) => {
                    const answered = props.choices[props.shuffledCard.deck_card_id] != null;
                    const correct = answered && originalIndex === 0;
                    const incorrect = answered && originalIndex !== 0;
                    const selected = props.choices[props.shuffledCard.deck_card_id] === originalIndex;

                    return (
                        <button
                            key={i}
                            className={clsx(
                                "border",
                                correct && "bg-green-500",
                                incorrect && "bg-red-500",
                                selected && "border-2 border-blue-500"
                            )}
                            onClick={() => {
                                // No Function or Already Answered
                                if (!props.selectChoice || props.choices[props.shuffledCard.deck_card_id] != null)
                                    return;
                                props.selectChoice(originalIndex)
                            }}
                        >
                            <div>
                                {shuffledWordDef}
                            </div>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}