import { DeckType } from "@/services/server/deck";
import { DeckGradedType } from "@/services/server/deckGraded";
import clsx from "clsx";
import { PlusCircle } from "lucide-react";
import { Fragment } from "react/jsx-runtime";
import Deck from "./Deck";


interface ShowDeckProps {
    decks: DeckType[];
    decksGraded: DeckGradedType[];
    onCreateDeck: () => void;
    onDeleteDeck: (deckID: number) => void;
}


export default function ShowDecks(props: ShowDeckProps) {
    return (
        <section className="w-full px-4 py-4 flex flex-wrap gap-4">
            <button
                className={clsx(
                    "w-[316px] max-w-[316px] min-w-[316px] p-2",
                    "flex flex-col gap-y-2",
                    "overflow-hidden",
                    "bg-zinc-900 border border-zinc-800 rounded-md group hover:bg-zinc-800 cursor-pointer"
                )}
                onClick={props.onCreateDeck}
            >
                <div className="h-full flex justify-center items-center">
                    <PlusCircle
                        size={24}
                        className="text-zinc-700 group-hover:text-white"
                    />
                </div>
            </button>
            {props.decks.map((deck) => (
                <Fragment key={deck.deck_id}>
                    <Deck
                        deck={deck}
                        decksGraded={props.decksGraded.filter(d => d.deck_id === deck.deck_id)}
                        onDeleteDeck={() => props.onDeleteDeck(deck.deck_id)}
                    />
                </Fragment>
            ))}
        </section>
    )
}