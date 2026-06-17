require('dotenv').config();
const mongoose = require('mongoose');
const Project = require('./models/Project');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/portfosilo';

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

mongoose
  .connect(MONGODB_URI)
  .then(async () => {
    console.log('Connected, seeding...');
    await Project.deleteMany({});
    await Project.insertMany(sample);
    console.log('Seed complete');
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
