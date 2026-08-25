const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const nodemailer = require('nodemailer');
const swaggerUi = require('swagger-ui-express');

require('dotenv').config();

const User = require('./models/User');
const Task = require('./models/Task');
const { authenticate, authorize } = require('./middleware/auth');
const swaggerSpecs = require('./config/swagger');

const app = express();
app.use(express.json());
app.use(cors());

// Swagger Route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error(err));

// Configure Nodemailer Transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// --- AUTHENTICATION ---

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword, role });
    res.status(201).json({ message: 'User registered', userId: user._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token, user: { id: user._id, name: user.name, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- TASK MANAGEMENT (CRUD, PAGINATION, FILTERING) ---

// Create Task
app.post('/api/tasks', authenticate, async (req, res) => {
  try {
    const { title, description, priority, dueDate, assignedTo } = req.body;
    const task = await Task.create({
      title,
      description,
      priority,
      dueDate,
      assignedTo: assignedTo || req.user.id,
      createdBy: req.user.id
    });
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Tasks (Paginated, Filtered, Searched)
app.get('/api/tasks', authenticate, async (req, res) => {
  try {
    const { page = 1, limit = 10, status, priority, search } = req.query;
    
    let filter = {};
    
    // Regular users see only their tasks; admins/managers see all
    if (req.user.role === 'user') {
      filter.assignedTo = req.user.id;
    }

    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (search) {
      filter.title = { $regex: search, $options: 'i' };
    }

    const tasks = await Task.find(filter)
      .populate('assignedTo', 'name email')
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ dueDate: 1 });

    const total = await Task.countDocuments(filter);

    res.json({
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalTasks: total,
      data: tasks
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Task / Status / Assignment
app.patch('/api/tasks/:id', authenticate, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    // Only creator, assignee, or manager/admin can update status
    if (req.user.role === 'user' && task.assignedTo.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized to update this task' });
    }

    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete Task (Admins & Managers Only)
app.delete('/api/tasks/:id', authenticate, authorize(['admin', 'manager']), async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- BONUS: EMAIL REMINDER API ---

app.post('/api/tasks/:id/remind', authenticate, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate('assignedTo', 'email name');
    if (!task) return res.status(404).json({ message: 'Task not found' });
    if (!task.assignedTo || !task.assignedTo.email) {
      return res.status(400).json({ message: 'No assignee email found for this task' });
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: task.assignedTo.email,
      subject: `Task Reminder: ${task.title}`,
      text: `Hello ${task.assignedTo.name},\n\nThis is a reminder for your task "${task.title}".\nDue Date: ${new Date(task.dueDate).toDateString()}\nStatus: ${task.status}`
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: `Reminder email sent to ${task.assignedTo.email}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server live on http://localhost:${PORT}`));