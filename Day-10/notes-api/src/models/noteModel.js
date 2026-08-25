// In-memory notes store (acts like a database)
let notes = [
  {
    id: 1,
    title: 'Meeting',
    content: 'Discuss project',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

let nextId = 2;

const getAll = () => notes;

const getById = (id) => notes.find(n => n.id === parseInt(id));

const create = ({ title, content }) => {
  const note = {
    id: nextId++,
    title,
    content,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  notes.push(note);
  return note;
};

const update = (id, { title, content }) => {
  const index = notes.findIndex(n => n.id === parseInt(id));
  if (index === -1) return null;

  notes[index] = {
    ...notes[index],
    title: title !== undefined ? title : notes[index].title,
    content: content !== undefined ? content : notes[index].content,
    updatedAt: new Date().toISOString()
  };

  return notes[index];
};

const remove = (id) => {
  const index = notes.findIndex(n => n.id === parseInt(id));
  if (index === -1) return null;
  return notes.splice(index, 1)[0];
};

module.exports = { getAll, getById, create, update, remove };