const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
// serve uploaded images
const fs = require('fs');
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
app.use('/uploads', express.static(uploadsDir));

// Routes
const projectsRouter = require('./routes/projects');
app.use('/api/projects', projectsRouter);
const authRouter = require('./routes/auth');
app.use('/api/auth', authRouter);

app.get('/', (req, res) => {
  res.send({ message: 'Personal portfolio API' });
});

// Serve static client in production (optional)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client', 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
  });
}

// Connect to MongoDB and start server
async function startServer() {
  let mongoUri = process.env.MONGODB_URI;
  let mongod;

  if (!mongoUri) {
    // Lazy-load mongodb-memory-server only when needed
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongod = await MongoMemoryServer.create();
      mongoUri = mongod.getUri();
      console.log('Started in-memory MongoDB');
    } catch (e) {
      console.error('mongodb-memory-server not available, and no MONGODB_URI provided. Install it or set MONGODB_URI.');
      console.error(e);
      process.exit(1);
    }
  }

  mongoose
    .connect(mongoUri)
    .then(() => {
      console.log('Connected to MongoDB');
      app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch((err) => {
      console.error('MongoDB connection error:', err);
      process.exit(1);
    });

  // Clean up in-memory server on exit
  if (mongod) {
    const cleanup = async () => {
      try {
        await mongoose.disconnect();
        await mongod.stop();
      } catch (err) {}
      process.exit(0);
    };
    process.on('SIGINT', cleanup);
    process.on('SIGTERM', cleanup);
  }
}

startServer();
