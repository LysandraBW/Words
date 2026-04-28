import express from "express";
import { 
    getDecks, 
    getDecksByBooks, 
    getDecksByChapters, 
    getDeck, 
    updateDeck, 
    deleteDeck, 
    createDeck, 
    reloadDeck 
} from "../controllers/deck.js";

const router = express.Router();

router.get('/', getDecks);
router.post('/byBooks', getDecksByBooks);
router.post('/byChapters', getDecksByChapters);
router.get('/:deck_id', getDeck);
router.put('/:deck_id', updateDeck);
router.delete('/:deck_id', deleteDeck);
router.post('/', createDeck);
router.put('/:deck_id/reload', reloadDeck);

export default router;