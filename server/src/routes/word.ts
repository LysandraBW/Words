import express from "express";
import { createword, decrementNumberInstances, deleteword, getword, incrementNumberInstances } from "../controllers/word.js";

const router = express.Router();

router.get('/:word_id', getword);
router.delete('/:word_id', deleteword);
router.put('/:word_id/increment', incrementNumberInstances);
router.put('/:word_id/decrement', decrementNumberInstances);
router.post('/', createword);

export default router;