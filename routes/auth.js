const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body || {};
    if (!name || !email || !password) return res.status(400).json({ message: 'Missing fields' });
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: 'Account already exists' });
    const hash = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hash });
    await user.save();
    const secret = process.env.JWT_SECRET || 'devsecret';
    const token = jwt.sign({ id: user._id, email: user.email }, secret, { expiresIn: '8h' });
    res.status(201).json({ token, user: { name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ message: 'Missing credentials' });

    // Try to find a user in DB
    const user = await User.findOne({ email });
    if (user) {
      const ok = await bcrypt.compare(password, user.password);
      if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
      const secret = process.env.JWT_SECRET || 'devsecret';
      const token = jwt.sign({ id: user._id, email: user.email }, secret, { expiresIn: '8h' });
      return res.json({ token, user: { name: user.name, email: user.email } });
    }

    // fallback to legacy admin env credentials (keeps prior behavior)
    const adminUser = process.env.ADMIN_USER || 'admin';
    const adminPass = process.env.ADMIN_PASS || 'password';
    if (email === adminUser && password === adminPass) {
      const secret = process.env.JWT_SECRET || 'devsecret';
      const token = jwt.sign({ username: email }, secret, { expiresIn: '8h' });
      return res.json({ token, user: { name: email, email } });
    }

    return res.status(401).json({ message: 'Invalid credentials' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
