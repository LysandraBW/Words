import { DeckType } from "@/services/server/deck";
import { DeckGradedType } from "@/services/server/deckGraded";
import clsx from "clsx";
import { ArrowUpRightFromSquareIcon, MoveUpIcon, Trash2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { pixelifySans } from "../fonts";


interface DeckProps {
    deck: DeckType;
    decksGraded: DeckGradedType[];
    onDeleteDeck: () => void;
}


export default function Deck(props: DeckProps) {
    const router = useRouter();

    // Context Menu
    const [rightClick, setRightClick] = useState<{x: number; y: number}|null>();
    const show = !!rightClick;

    // Change in Accuracy;
    const [change, setChange] = useState<number|null>();
    const [lastResults, setLastResults] = useState<DeckGradedType|null>();


    useEffect(() => {
        window.addEventListener('click', () => setRightClick(null));
        return () => window.removeEventListener('click', close);
    }, []);


    useEffect(() => {
        // Should have a field storing the date and time
        // at which the user finished the quiz. However,
        // I did not. So, I'll be using IDs for now.
        const sortedDecksGraded = props.decksGraded.toSorted((a, b) => a.deck_graded_id - b.deck_graded_id);
        const lastTwo = sortedDecksGraded.slice(-2);
        const lastAccuracy = lastTwo[1] == null ? -1 : lastTwo[1].number_correct/(lastTwo[1].number_correct+lastTwo[1].number_incorrect);
        const secondToLastAccuracy = lastTwo[0] == null ? -1 : lastTwo[0].number_correct/(lastTwo[0].number_correct+lastTwo[0].number_incorrect);
        const change = lastTwo.length === 2 ? (secondToLastAccuracy - lastAccuracy) * 100 : lastTwo.length === 1 ? secondToLastAccuracy * 100 : null;
        setChange(change);
        setLastResults(lastTwo.length ? lastTwo[0] : null);
    }, [props.deck, props.decksGraded]);


    return (
        <>
            <button
                className={clsx(
                    "w-[316px] max-w-[316px] min-w-[316px] p-2",
                    "flex justify-between gap-x-2",
                    "overflow-hidden",
                    "bg-neutral-900 border border-neutral-800 rounded-md group hover:bg-neutral-800 cursor-pointer"
                )}
                onClick={() => router.push(`/deck?deckID=${props.deck.deck_id}`)}
                onContextMenu={(e) => {
                    e.preventDefault();
                    setRightClick({ x: e.clientX, y: e.clientY });
                }}
            >
                <div className="col-start-2">
                    <h6 className="font-medium text-neutral-500 text-sm tracking-wide capitalize text-left">
                        {props.deck.deck_name}
                    </h6>
                    {/* <p className="text-neutral-500 text-sm tracking-wide overflow-hidden text-ellipsis line-clamp-2 text-left">
                        {props.deck.deck_words.length} Word{props.deck.deck_words.length === 1 ? '' : 's'}
                    </p> */}
                    <span
                        className={clsx(
                            'block',
                            pixelifySans.className, 
                            "text-xs text-neutral-500",
                            'tracking-wide'
                        )}
                    >
                        {props.deck.deck_words.length} Word{props.deck.deck_words.length === 1 ? '' : 's'}, Done {props.decksGraded.length}x
                    </span>
                </div>
                <div className="col-start-3 flex flex-col justify-center items-center">
                    <div className="flex items-center">
                        <span
                            className={clsx(
                                'block',
                                'text-xl',
                                pixelifySans.className,
                                change != null && change > 0 && "text-green-500",
                                change != null && change < 0 && "text-red-500",
                                change != null && change === 0 && "text-neutral-500",
                                'tracking-wide'
                            )}
                        >
                            {change}%
                        </span>
                    </div>
                    {/* <span
                        className={clsx(
                            'block',
                            pixelifySans.className, 
                            "text-xs text-neutral-500",
                            'tracking-wide'
                        )}
                    >
                        Done {props.decksGraded.length}x
                    </span> */}
                </div>
            </button>
            {/* Context Menu */}
            {show &&
                <div 
                    style={{
                        position: 'fixed',
                        zIndex: 100,
                        top: rightClick.y,
                        left: rightClick.x
                    }}
                    className="min-w-[calc(16px*8)] bg-neutral-800 border border-neutral-700 rounded-md"
                >
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            window.open(`/deck?deckID=${props.deck.deck_id}`, '_blank');
                        }}
                        className="w-full p-1 flex items-center gap-x-2 border-b border-b-neutral-700 first:rounded-t-md last:rounded-b-md last:border-b-0 group cursor-pointer"
                    >
                        <ArrowUpRightFromSquareIcon
                            size={16}
                            className="text-neutral-500 group-hover:text-white relative top-[-1px]"
                        />
                        <label className="text-neutral-500 text-sm tracking-wide group-hover:text-white">
                            Open
                        </label>
                    </button>
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            props.onDeleteDeck();
                        }}
                        className="w-full p-1 flex items-center gap-x-2 border-b border-b-neutral-700 first:rounded-t-md last:rounded-b-md last:border-b-0 group cursor-pointer"
                    >
                        <Trash2Icon
                            size={16}
                            className="text-neutral-500 group-hover:text-red-500 relative top-[-1px]"
                        />
                        <label className="text-neutral-500 text-sm tracking-wide group-hover:text-red-500">
                            Delete
                        </label>
                    </button>
                </div>
            }
        </>
    )
}