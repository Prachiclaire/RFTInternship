const noteModel = require('../models/noteModel');
const { isNonEmptyString, VALID_SORT_FIELDS, VALID_ORDERS } = require('../utils/validators');

// POST /notes - Add note
const addNote = (req, res) => {
  const { title, content } = req.body;

  if (!isNonEmptyString(title)) {
    return res.status(400).json({ success: false, message: 'title is required and cannot be empty' });
  }
  if (!isNonEmptyString(content)) {
    return res.status(400).json({ success: false, message: 'content is required and cannot be empty' });
  }

  const note = noteModel.create({ title: title.trim(), content: content.trim() });
  res.status(201).json({ success: true, message: 'Note added', data: note });
};

// GET /notes - Get all notes (supports ?search= and ?sortBy=&order=)
const getAllNotes = (req, res) => {
  let notes = noteModel.getAll();
  const { search, sortBy, order } = req.query;

  // Bonus: search notes by keyword (matches title or content, case-insensitive)
  if (search) {
    const keyword = search.toLowerCase();
    notes = notes.filter(n =>
      n.title.toLowerCase().includes(keyword) || n.content.toLowerCase().includes(keyword)
    );
  }

  // Bonus: sort notes
  if (sortBy) {
    if (!VALID_SORT_FIELDS.includes(sortBy)) {
      return res.status(400).json({
        success: false,
        message: `sortBy must be one of: ${VALID_SORT_FIELDS.join(', ')}`
      });
    }
    const sortOrder = VALID_ORDERS.includes(order) ? order : 'asc';

    notes = [...notes].sort((a, b) => {
      const valA = a[sortBy];
      const valB = b[sortBy];
      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }

  res.status(200).json({ success: true, count: notes.length, data: notes });
};

// GET /notes/:id - Get single note
const getNote = (req, res) => {
  const note = noteModel.getById(req.params.id);
  if (!note) {
    return res.status(404).json({ success: false, message: 'Note not found' });
  }
  res.status(200).json({ success: true, data: note });
};

// PUT /notes/:id - Update note
const updateNote = (req, res) => {
  const { title, content } = req.body;

  if (title === undefined && content === undefined) {
    return res.status(400).json({ success: false, message: 'Provide at least title or content to update' });
  }
  if (title !== undefined && !isNonEmptyString(title)) {
    return res.status(400).json({ success: false, message: 'title cannot be empty' });
  }
  if (content !== undefined && !isNonEmptyString(content)) {
    return res.status(400).json({ success: false, message: 'content cannot be empty' });
  }

  const updated = noteModel.update(req.params.id, {
    title: title !== undefined ? title.trim() : undefined,
    content: content !== undefined ? content.trim() : undefined
  });

  if (!updated) {
    return res.status(404).json({ success: false, message: 'Note not found' });
  }

  res.status(200).json({ success: true, message: 'Note updated', data: updated });
};

// DELETE /notes/:id - Delete note
const deleteNote = (req, res) => {
  const deleted = noteModel.remove(req.params.id);
  if (!deleted) {
    return res.status(404).json({ success: false, message: 'Note not found' });
  }
  res.status(200).json({ success: true, message: 'Note deleted', data: deleted });
};

module.exports = { addNote, getAllNotes, getNote, updateNote, deleteNote };