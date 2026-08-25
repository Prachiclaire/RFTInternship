const express = require('express');
const noteRoutes = require('./src/routes/notes');

const app = express();

app.use(express.json());

// Routes
app.use('/notes', noteRoutes);

// Root
app.get('/', (req, res) => {
  res.json({
    message: 'Notes API - Day 10',
    endpoints: {
      addNote:     'POST   /notes',
      getAllNotes: 'GET    /notes',
      searchNotes: 'GET    /notes?search=keyword',
      sortNotes:   'GET    /notes?sortBy=title|createdAt&order=asc|desc',
      getOneNote:  'GET    /notes/:id',
      updateNote:  'PUT    /notes/:id',
      deleteNote:  'DELETE /notes/:id'
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;