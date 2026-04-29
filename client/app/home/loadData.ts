import { selectBooks } from "@/services/db/book";
import { selectDecks } from "@/services/db/deck";
import { selectDecksGraded } from "@/services/db/deckGraded";
import { selectWords } from "@/services/db/word";

export default async function loadData() {
    const [books, decks, decksGraded, words] = await Promise.all([
        (async () => {
            const books = await selectBooks();
            if (!books) 
                throw new Error('Failed to Load Books');
            return books;
        })(),
        (async () => {
            const decks = await selectDecks();
            if (!decks) 
                throw new Error('Failed to Load Decks');
            return decks;
        })(),
        (async () => {
            const decksGraded = await selectDecksGraded();
            if (!decksGraded) 
                throw new Error('Failed to Load Decks Graded');
            return decksGraded;
        })(),
        (async () => {
            const words = await selectWords();
            if (!words)
                throw new Error('Failed to Load Words');
            return words;
        })()
    ]);

    return {
        books,
        decks,
        decksGraded,
        words
    }
}