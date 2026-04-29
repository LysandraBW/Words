import { useRouter } from "next/navigation";
import { DeckGradedType } from "@/services/db/deckGraded";
import { useEffect, useState } from "react";
import { DeckType, selectDeck } from "@/services/db/deck";


interface ShowDecksGradedProps {
    decksGraded: DeckGradedType[];
}


export default function ShowDecksGraded(props: ShowDecksGradedProps) {
    const router = useRouter();
    const [decks, setDecks] = useState<{[deckGradedID: number]: DeckType}>();


    useEffect(() => {
        const load = async () => {
            try {
                const decks: {[deckGradedID: number]: DeckType} = Object.fromEntries(await Promise.all(props.decksGraded.map(async (deckGraded) => {
                    const output = await selectDeck(deckGraded.deck_id);
                    if (!output)
                        throw new Error('Failed to Load Deck');
                    return [deckGraded.deck_graded_id, output.deck];
                })));
                setDecks(decks);
            }
            catch (err) {
                alert((err as Error).message);
            }
        }
        load();
    }, []);


    if (!decks)
        return <>Loading...</>;


    return (
        <section className="w-full px-4 py-4">
            <h3 className="mb-4 text-lg text-white font-medium tracking-tight">
                Recent Results
            </h3>
            <div className="flex flex-wrap gap-8">
                {props.decksGraded.map(deck => (
                    <button 
                        key={deck.deck_graded_id}
                        onClick={() => router.push(`/deck?deckID=${deck.deck_id}&deckGradedID=${deck.deck_graded_id}`)}
                    >
                        Duration: {deck.duration}ms
                        Score: {deck.number_correct}/{deck.number_correct+deck.number_incorrect}
                    </button>
                ))}
            </div>
        </section>
    )
}