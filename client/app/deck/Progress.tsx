import { DeckType } from "@/services/server/deck";
import clsx from "clsx";

interface ProgressProps {
    numberQuestions: number;
    index: number;
    choices: {[index: number]: number};
    onClickIndex: (index: number) => void;
}


export default function Progress(props: ProgressProps) {
    return (
        <div>
            {[...Array(props.numberQuestions)].map((e, i) => {
                const unanswered = props.choices[i] == null;
                const correct = !unanswered && props.choices[i] === 0;
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