import { selectBooks } from "@/services/server/book";
import { selectDeck, selectDeckWords } from "@/services/server/deck";
import { DeckGradedCardType, selectDeckGraded, selectDecksGradedByDeck } from "@/services/server/deckGraded";


export default async function loadData(deckID: number) {
    const [books, deck, decksGraded, words] = await Promise.all([
        (async () => {
            const books = await selectBooks();
            return books;
        })(),
        (async () => {
            const deck = await selectDeck(deckID);
            return deck;
        })(),
        (async () => {
            const decksGraded = await selectDecksGradedByDeck(deckID);
            return decksGraded;
        })(),
        (async () => {
            const words = await selectDeckWords(deckID);
            return words;
        })()
    ]);

    const decksGradedCards = Object.fromEntries(await Promise.all(decksGraded.map(async (deck) => {
        const output = await selectDeckGraded(deck.deck_graded_id);
        return [deck.deck_graded_id, output.deckGradedCards];
    }))) as {[deckGradedID: number]: DeckGradedCardType[]};
    
    return {
        books,
        deck,
        decksGraded,
        decksGradedCards,
        words
    }
}