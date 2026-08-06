import { selectBook, selectBookChapters, selectBookWords } from "@/services/server/book";
import { selectDecksByBook } from "@/services/server/deck";
import { selectDecksGradedByBook } from "@/services/server/deckGraded";


export default async function loadData(bookID: number) {
    const [book, chapters, words, decks, decksGraded] = await Promise.all([
        (async () => {
            const book = await selectBook(bookID);
            return book;
        })(),
        (async () => {
            const chapters = await selectBookChapters(bookID);
            return chapters;
        })(),
        (async () => {
            const words = await selectBookWords(bookID);
            return words;
        })(),
        (async () => {
            const decks = await selectDecksByBook
            (bookID);
            return decks;
        })(),
        (async () => {
            const decksGraded = await selectDecksGradedByBook(bookID);
            return decksGraded;
        })()
    ]);

    return {
        book,
        chapters,
        words,
        decks,
        decksGraded
    }
}