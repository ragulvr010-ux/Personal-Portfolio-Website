const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  shortDescription: { type: String },
  description: { type: String },
  tech: { type: [String], default: [] },
  image: { type: String }, // stored path or URL
  repo: { type: String }, // GitHub repository link
  demo: { type: String }, // Live demo link
  status: { type: String, enum: ['Completed', 'Ongoing', 'Planned'], default: 'Planned' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Project', ProjectSchema);
