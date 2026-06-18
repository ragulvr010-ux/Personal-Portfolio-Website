const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
const projectsRouter = require('./routes/projects');
const contactRouter = require('./routes/contact');
const authRouter = require('./routes/auth');

app.use('/api/projects', projectsRouter);
app.use('/api/contact', contactRouter);
app.use('/api/auth', authRouter);

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/portfolio';
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error('Failed to start server', err);
    process.exit(1);
  }
}

start();
