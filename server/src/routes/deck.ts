import express from "express";
import { 
    createDeck, 
    createGradedDeck, 
    deleteDeck, 
    deleteGradedDeck, 
    getDeck, 
    getDecks, 
    getGradedDeck, 
    getGradedDecks, 
    updateDeck, 
} from "../controllers/deck.js";

const router = express.Router();

router.get('/', getDecks);
router.get('/:deck_id', getDeck);
router.put('/:deck_id', updateDeck);
router.delete('/:deck_id', deleteDeck);
router.post('/', createDeck);

router.get('/graded', getGradedDecks);
router.get('/graded/:deck_graded_id', getGradedDeck);
router.delete('/graded/:deck_graded_id', deleteGradedDeck);
router.post('/graded', createGradedDeck);

export default router;