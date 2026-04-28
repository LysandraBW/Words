import express from "express";
import { 
    getDecks,
    getDeck, 
    updateDeck, 
    deleteDeck, 
    createDeck, 
    reloadDeck, 
    getDeckGradedDecks,
    getDeckWords
} from "../controllers/deck.js";

const router = express.Router();

router.get('/', getDecks);
router.post('/', createDeck);
router.get('/:deck_id', getDeck);
router.get('/:deck_id/words', getDeckWords);
router.get('/:deck_id/decksGraded', getDeckGradedDecks);
router.put('/:deck_id', updateDeck);
router.delete('/:deck_id', deleteDeck);
router.put('/:deck_id/reload', reloadDeck);

export default router;