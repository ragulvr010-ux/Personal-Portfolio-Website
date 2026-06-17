const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const auth = require('../middleware/auth');
const multer = require('multer');
const { body, validationResult } = require('express-validator');
const path = require('path');

// multer setup for image uploads with validation
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: function (req, file, cb) {
    const allowed = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'];
    if (!allowed.includes(file.mimetype)) return cb(new Error('Invalid file type'));
    cb(null, true);
  }
});

// GET /api/projects - list with optional search/filter
router.get('/', async (req, res) => {
  try {
    const { q, tech, status } = req.query;
    const filter = {};
    if (q) filter.title = { $regex: q, $options: 'i' };
    if (tech) filter.tech = { $in: Array.isArray(tech) ? tech : [tech] };
    if (status) filter.status = status;
    const projects = await Project.find(filter).sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DEV: seed sample data via API (only allowed in non-production)
router.post('/seed', async (req, res) => {
  if (process.env.NODE_ENV === 'production') return res.status(403).json({ message: 'Not allowed' });
  try {
    const sample = [
      {
        title: 'Portfolio Website',
        shortDescription: 'Personal portfolio built with React and Express',
        description: 'A personal portfolio built with React and Express',
        tech: ['React', 'Node.js', 'Express', 'MongoDB'],
        repo: 'https://github.com/example/portfolio',
        demo: 'https://example.com',
        status: 'Completed',
        image: ''
      },
      {
        title: 'Todo App',
        shortDescription: 'A simple todo app with authentication',
        description: 'A simple todo app with authentication',
        tech: ['React', 'Firebase'],
        repo: '',
        demo: '',
        status: 'Planned',
        image: ''
      }
    ];
    await Project.deleteMany({});
    const inserted = await Project.insertMany(sample);
    res.json({ inserted });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/projects - create (protected)
// In development allow unauthenticated project creation to simplify local testing
router.post('/', (req, res, next) => {
  if (process.env.NODE_ENV !== 'production') return next();
  return auth(req, res, next);
}, upload.single('image'), [
  body('title').notEmpty().withMessage('Title required'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  try {
    // debug logs
    console.log('POST /api/projects - body keys:', Object.keys(req.body));
    if (req.file) console.log('POST /api/projects - file:', req.file.originalname, req.file.mimetype, req.file.size);

    const payload = { ...req.body };
    // normalize tech: accept JSON string or comma-separated string
    if (payload.tech && typeof payload.tech === 'string') {
      try { payload.tech = JSON.parse(payload.tech); }
      catch (e) { payload.tech = payload.tech.split(',').map(s=>s.trim()).filter(Boolean); }
    }
    if (req.file) payload.image = '/uploads/' + req.file.filename;
    const proj = new Project(payload);
    const saved = await proj.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error('Error creating project:', err);
    if (err.code === 'LIMIT_FILE_SIZE') return res.status(400).json({ message: 'File too large' });
    if (err.message && err.message.includes('Invalid file type')) return res.status(400).json({ message: 'Invalid file type' });
    res.status(400).json({ message: err.message });
  }
});

// GET /api/projects/stats - simple statistics
router.get('/stats/all', async (req, res) => {
  try {
    const total = await Project.countDocuments();
    const completed = await Project.countDocuments({ status: 'Completed' });
    const ongoing = await Project.countDocuments({ status: 'Ongoing' });
    const planned = await Project.countDocuments({ status: 'Planned' });
    const recent = await Project.find().sort({ createdAt: -1 }).limit(5);
    res.json({ total, completed, ongoing, planned, recent });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/projects/:id
router.get('/:id', async (req, res) => {
  try {
    const proj = await Project.findById(req.params.id);
    if (!proj) return res.status(404).json({ message: 'Not found' });
    res.json(proj);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/projects/:id (protected)
router.put('/:id', (req, res, next) => {
  if (process.env.NODE_ENV !== 'production') return next();
  return auth(req, res, next);
}, upload.single('image'), async (req, res) => {
  try {
    console.log('PUT /api/projects/:id - body keys:', Object.keys(req.body));
    if (req.file) console.log('PUT /api/projects/:id - file:', req.file.originalname, req.file.mimetype, req.file.size);
    const payload = { ...req.body };
    if (payload.tech && typeof payload.tech === 'string') {
      try { payload.tech = JSON.parse(payload.tech); }
      catch (e) { payload.tech = payload.tech.split(',').map(s=>s.trim()).filter(Boolean); }
    }
    if (req.file) payload.image = '/uploads/' + req.file.filename;
    const updated = await Project.findByIdAndUpdate(req.params.id, payload, { new: true });
    res.json(updated);
  } catch (err) {
    console.error('Error updating project:', err);
    if (err.code === 'LIMIT_FILE_SIZE') return res.status(400).json({ message: 'File too large' });
    if (err.message && err.message.includes('Invalid file type')) return res.status(400).json({ message: 'Invalid file type' });
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/projects/:id (protected)
// In development allow unauthenticated delete to simplify local testing
router.delete('/:id', (req, res, next) => {
  if (process.env.NODE_ENV !== 'production') return next();
  return auth(req, res, next);
}, async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/projects/stats - simple statistics
router.get('/stats/all', async (req, res) => {
  try {
    const total = await Project.countDocuments();
    const completed = await Project.countDocuments({ status: 'Completed' });
    const recent = await Project.find().sort({ createdAt: -1 }).limit(5);
    res.json({ total, completed, recent });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
