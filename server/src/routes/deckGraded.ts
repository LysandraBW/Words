import express from "express";
import { 
    getGradedDecks, 
    getGradedDeck, 
    deleteGradedDeck, 
    createGradedDeck} from "../controllers/deckGraded.js";

const router = express.Router();

router.get('/', getGradedDecks);
router.post('/', createGradedDeck);
router.get('/:deck_graded_id', getGradedDeck);
router.delete('/:deck_graded_id', deleteGradedDeck);

export default router;