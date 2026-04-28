import { Router } from "express";
import wordRouter from "./routes/word.js";
import bookRouter from "./routes/book.js";
import readerRouter from "./routes/reader.js";
import chapterRouter from "./routes/chapter.js";
import deckRouter from "./routes/deck.js";
import deckGradedRouter from "./routes/deck.js";

const router = Router();

router.use('/books', bookRouter);
router.use('/words', wordRouter);
router.use('/readers', readerRouter);
router.use('/chapters', chapterRouter);
router.use('/decks', deckRouter);
router.use('/decksGraded', deckGradedRouter);

export default router;