import Button from "@/components/Button";
import { DeckType } from "@/services/db/deck";
import { TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { MouseEvent } from "react";
import { Fragment } from "react/jsx-runtime";

interface ShowDeckProps {
    decks: DeckType[];
    onCreateDeck: () => void;
    onDeleteDeck: (deckID: number) => void;
}


export default function ShowDecks(props: ShowDeckProps) {
    const router = useRouter();


    const onClickDeleteDeck = (deckID: number, event: any) => {
        event.preventDefault();
        event.stopPropagation();
        props.onDeleteDeck(deckID);
    }

    
    return (
        <section className="w-full px-4 py-4">
            <h3 className="mb-4 text-lg text-white font-medium tracking-tight">
                Decks
            </h3>
            <div className="flex flex-wrap gap-8">
                <Button
                    label="Create Deck"
                    onClick={props.onCreateDeck}
                />
                {props.decks.map((deck) => (
                    <Fragment key={deck.deck_id}>
                        <p 
                            className="p-4 text-white bg-orange-500"
                            onClick={() => router.push(`/deck?deckID=${deck.deck_id}`)}
                        >
                            {deck.deck_name}, {deck.deck_chapters.length} Chapters
                            <TrashIcon
                                onClick={(event) => onClickDeleteDeck(deck.deck_id, event)}
                            />
                        </p>
                    </Fragment>
                ))}
            </div>
        </section>
    )
}