import express from "express";
import { createChapter, deleteChapter, getChapter, getChapterDecks, getChapterGradedDecks, getChapters, getChapterWords, updateChapter } from "../controllers/chapter.js";

const router = express.Router();

router.get('/', getChapters);
router.get('/:chapter_id', getChapter);
router.get('/:chapter_id/words', getChapterWords);
router.get('/:chapter_id/decks', getChapterDecks);
router.get('/:chapter_id/decksGraded', getChapterGradedDecks);
router.put('/:chapter_id', updateChapter);
router.delete('/:chapter_id', deleteChapter);
router.post('/', createChapter);

export default router;