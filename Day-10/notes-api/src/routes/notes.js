const express = require('express');
const router = express.Router();
const { addNote, getAllNotes, getNote, updateNote, deleteNote } = require('../controllers/noteController');

router.get('/',     getAllNotes);  // GET all notes (supports ?search= and ?sortBy=&order=)
router.get('/:id',  getNote);      // GET single note
router.post('/',    addNote);      // ADD note
router.put('/:id',  updateNote);   // UPDATE note
router.delete('/:id', deleteNote); // DELETE note

module.exports = router;