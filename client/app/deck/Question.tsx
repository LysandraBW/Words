import { DeckExtendedType } from "@/app/deck/shuffleCards";
import clsx from "clsx";


interface QuestionProps {
    question: DeckExtendedType["deck_questions"][number];
    choice: number | null | undefined;
    onSelectChoice?: (choice: number) => void;
}


export default function Question(props: QuestionProps) {
    const word = props.question.words.find(word => word[2] === 0);
    if (!word)
        return <></>;

    return (
        <div>
            <p>Select the Definition of Word: <b>{word[0]}</b></p>
            <div className="grid grid-cols-2 grid-rows-2 gap-2">
                {props.question.words.map(([shuffledWord, shuffledWordDef, originalIndex], i) => {
                    const answered = props.choice != null;
                    const correct = answered && originalIndex === 0;
                    const incorrect = answered && originalIndex !== 0;
                    const selected = props.choice === originalIndex;

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
                                if (!props.onSelectChoice || props.choice != null)
                                    return;
                                props.onSelectChoice(originalIndex)
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