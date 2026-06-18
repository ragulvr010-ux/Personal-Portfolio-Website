import React from 'react';

export default function ProjectCard({ project, onDelete }) {
  return (
    <div className="border p-4 rounded">
      <h3 className="font-semibold">{project.title}</h3>
      <p className="text-sm mt-2">{project.description}</p>
      <div className="mt-2 text-xs text-gray-600">{(project.technologies || []).join(', ')}</div>
      <div className="mt-3 flex gap-2">
        {project.githubLink && <a href={project.githubLink} className="text-blue-600">GitHub</a>}
        {project.liveLink && <a href={project.liveLink} className="text-blue-600">Live</a>}
        {onDelete && <button onClick={() => onDelete(project._id)} className="ml-auto text-red-600">Delete</button>}
      </div>
    </div>
  );
}
