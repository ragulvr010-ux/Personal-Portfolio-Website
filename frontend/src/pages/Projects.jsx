import React, { useEffect, useState } from 'react';
import api from '../api';
import ProjectCard from '../components/ProjectCard';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [q, setQ] = useState('');

  useEffect(() => {
    api.get('/api/projects').then(res => setProjects(res.data)).catch(console.error);
  }, []);

  const filtered = projects.filter(p => (p.title + ' ' + (p.description||'') + ' ' + (p.technologies||[]).join(' ')).toLowerCase().includes(q.toLowerCase()));

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Projects</h2>
      <div className="mb-4">
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search projects..." className="w-full md:w-1/2 border p-2" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(p => <ProjectCard key={p._id} project={p} />)}
      </div>
    </div>
  );
}
