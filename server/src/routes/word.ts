import express from "express";
import { createWord, decrementNumberInstances, deleteWord, getWord, getWords, incrementNumberInstances } from "../controllers/word.js";

const router = express.Router();

router.get('/', getWords);
router.get('/:word_id', getWord);
router.delete('/:word_id', deleteWord);
router.get('/:word_id/increment', incrementNumberInstances);
router.get('/:word_id/decrement', decrementNumberInstances);
router.post('/', createWord);

export default router;