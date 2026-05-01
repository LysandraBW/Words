import { useRouter } from "next/navigation";
import { DeckGradedType } from "@/services/server/deckGraded";


interface ShowDecksGradedProps {
    decksGraded: DeckGradedType[];
}


export default function ShowDecksGraded(props: ShowDecksGradedProps) {
    const router = useRouter();


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
                        className="text-white"
                    >
                        Duration: {deck.duration}ms
                        Score: {deck.number_correct}/{deck.number_correct+deck.number_incorrect}
                    </button>
                ))}
            </div>
        </section>
    )
}