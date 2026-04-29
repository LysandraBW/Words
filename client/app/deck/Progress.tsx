import { DeckCardExtendedType } from "@/app/deck/shuffleCards";
import { DeckCardType } from "@/services/server/deck";
import clsx from "clsx";

interface ProgressProps {
    cards: DeckCardType[];
    shuffledCards: DeckCardExtendedType[];
    choices: {[index: number]: number};
    index: number;
    onClickIndex: (index: number) => void;
}


export default function Progress(props: ProgressProps) {
    return (
        <div>
            {[...Array(props.cards.length)].map((e, i) => {
                const unanswered = props.choices[props.shuffledCards[i].deck_card_id] == null;
                const correct = !unanswered && props.choices[props.shuffledCards[i].deck_card_id] === 0;
                const incorrect = !unanswered && !correct;

                return (
                    <button 
                        key={i}
                        onClick={() => props.onClickIndex(i)}
                        className={clsx(
                            "p-2 bg-black text-white",
                            props.index === i && "!bg-blue-500",
                            correct && "bg-green-500",
                            incorrect && "bg-red-500",
                            unanswered && "bg-gray-500",
                        )}
                    >
                        {i+1}
                    </button>
                )
            })}
        </div>
    )
}