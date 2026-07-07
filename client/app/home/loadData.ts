import { selectBooks } from "@/services/server/book";
import { selectChapters } from "@/services/server/chapter";
import { selectDecks } from "@/services/server/deck";
import { selectDecksGraded } from "@/services/server/deckGraded";
import { selectWords } from "@/services/server/word";

export default async function loadData() {
    const [books, chapters, decks, decksGraded, words] = await Promise.all([
        (async () => {
            const books = await selectBooks();
            return books;
        })(),
        (async () => {
            const chapters = await selectChapters();
            return chapters;
        })(),
        (async () => {
            const decks = await selectDecks();
            return decks;
        })(),
        (async () => {
            const decksGraded = await selectDecksGraded();
            return decksGraded;
        })(),
        (async () => {
            const words = await selectWords();
            return words;
        })()
    ]);

    return {
        books,
        chapters,
        decks,
        decksGraded,
        words
    }
}