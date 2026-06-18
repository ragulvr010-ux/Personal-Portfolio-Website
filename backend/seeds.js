require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Project = require('./models/Project');

async function run() {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/portfolio';
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to MongoDB for seeding');

  // create admin user
  const email = 'admin@example.com';
  const existing = await User.findOne({ email });
  if (!existing) {
    const hash = await bcrypt.hash('password123', 10);
    await User.create({ name: 'Admin', email, password: hash });
    console.log('Created admin user: admin@example.com / password123');
  } else {
    console.log('Admin user already exists');
  }

  // sample projects
  const projects = [
    {
      title: 'E-Commerce Website',
      description: 'MERN e-commerce demo',
      technologies: ['MongoDB', 'Express', 'React', 'Node'],
      githubLink: '',
      liveLink: '',
    },
    {
      title: 'Portfolio Website',
      description: 'Personal portfolio built with React and Node',
      technologies: ['React', 'Tailwind', 'Node'],
    },
  ];

  for (const p of projects) {
    const exists = await Project.findOne({ title: p.title });
    if (!exists) await Project.create(p);
  }

  console.log('Seeding complete');
  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
