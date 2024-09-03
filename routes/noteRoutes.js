import express from 'express';
const router = express.Router();
import { getAllNotes, createNewNote, updateNote, deleteNote } from '../controllers/notesController.js';
import verifyJWT from '../middleware/verigyJWT.js';

router.use(verifyJWT);

router.route('/')
    .get(getAllNotes)
    .post(createNewNote)
    .patch(updateNote)
    .delete(deleteNote);

export default router;