export interface Deck {
    name: string;
    numberWords: number;
    books: Array<string>;
    chapters: Array<string>;
}

interface OverviewDeckProps {
    deck: Deck;
    onClick: () => void;
}

export default function OverviewDeck(props: OverviewDeckProps) {
    return (
        <div
            className="w-[160px] h-[160px] p-4 bg-white"
            onClick={props.onClick}
        >
            <span>
                {props.deck.name}
            </span>
            <span>
                {props.deck.numberWords} Words
            </span>
        </div>
    );
}