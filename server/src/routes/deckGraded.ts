import express from "express";
import { 
    getGradedDecksByBooks, 
    getGradedDecksByChapters, 
    getGradedDecks, 
    getGradedDeck, 
    deleteGradedDeck, 
    createGradedDeck, 
    getGradedDecksByDeck
} from "../controllers/deckGraded.js";

const router = express.Router();

router.get('/', getGradedDecks);
router.post('/byBooks', getGradedDecksByBooks);
router.post('/byChapters', getGradedDecksByChapters);
router.post('/byDeck/:deck_id', getGradedDecksByDeck);
router.get('/:deck_graded_id', getGradedDeck);
router.delete('/:deck_graded_id', deleteGradedDeck);
router.post('/', createGradedDeck);

export default router;