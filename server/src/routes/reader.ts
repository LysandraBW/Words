import express from "express";
import { deleteReader, getReader, signIn, signOut, signUp, updateReader } from "../controllers/reader.js";

const router = express.Router();

router.post('/signIn', signIn);
router.post('/signUp', signUp);
router.post('/signOut', signOut);
router.get('/', getReader);
router.put('/', updateReader);
router.delete('/', deleteReader);

export default router;