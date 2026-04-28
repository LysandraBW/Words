import express from "express";
import { createBook, deleteBook, getBook, getBookChapters, getBookDecks, getBookGradedDecks, getBooks, getBookWords, updateBook } from "../controllers/book.js";

const router = express.Router();

router.get('/', getBooks);
router.get('/:book_id', getBook);
router.get('/:book_id/words', getBookWords);
router.get('/:book_id/chapters', getBookChapters);
router.get('/:book_id/decks', getBookDecks);
router.get('/:book_id/decksGraded', getBookGradedDecks);
router.put('/:book_id', updateBook);
router.delete('/:book_id', deleteBook);
router.post('/', createBook);

export default router;