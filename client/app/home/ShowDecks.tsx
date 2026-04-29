import Button from "@/components/Button";
import { DeckType } from "@/services/server/deck";
import { ArrowUpRightFromSquareIcon, TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Fragment } from "react/jsx-runtime";

interface ShowDeckProps {
    decks: DeckType[];
    onCreateDeck: () => void;
    onDeleteDeck: (deckID: number) => void;
}


export default function ShowDecks(props: ShowDeckProps) {
    const router = useRouter();
    
    
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
                    <div 
                        key={deck.deck_id}
                        className="bg-white"
                    >
                        <ArrowUpRightFromSquareIcon
                            onClick={() => router.push(`/deck?deckID=${deck.deck_id}`)}
                        />
                        <TrashIcon 
                            onClick={() => props.onDeleteDeck(deck.deck_id)}
                        />
                        <p className="p-4 text-white bg-orange-500">
                            {deck.deck_name}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    )
}