import { selectBooks } from "@/services/server/book";
import { selectDeck, selectDeckWords } from "@/services/server/deck";
import { selectDecksGradedByDeck } from "@/services/server/deckGraded";


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


    return {
        books,
        deck,
        decksGraded,
        words
    }
}