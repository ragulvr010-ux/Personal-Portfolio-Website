import React, { useEffect, useState } from 'react';
import api from '../api';
import { motion } from 'framer-motion';
import LazyImage from './LazyImage';

function ProjectCard({p}){
  return (
    <motion.div whileHover={{ y: -6 }} className="bg-white/60 dark:bg-black/60 rounded-lg overflow-hidden shadow">
      {p.image ? <div className="w-full h-40"><LazyImage src={p.image} alt={p.title} /></div> : <div className="w-full h-40 bg-gray-100" />}
      <div className="p-4">
        <h4 className="font-semibold">{p.title}</h4>
        <p className="text-sm mt-2">{p.description}</p>
        <div className="mt-3 flex gap-2 text-xs text-gray-600">
          {(p.technologies||[]).map(t=> <span key={t} className="px-2 py-1 bg-white/20 rounded">{t}</span>)}
        </div>
        <div className="mt-3 flex gap-2">
          {p.githubLink && <a href={p.githubLink} className="text-blue-600">GitHub</a>}
          {p.liveLink && <a href={p.liveLink} className="text-blue-600">Live</a>}
        </div>
      </div>
    </motion.div>
  );
}

export default function ProjectsSection(){
  const [projects, setProjects] = useState([]);
  useEffect(()=>{ api.get('/api/projects').then(r=>setProjects(r.data)).catch(()=>{}); },[]);

  return (
    <section id="projects" className="py-16">
      <div className="max-w-6xl mx-auto p-4">
        <h2 className="text-2xl font-bold mb-6">Projects</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {projects.map(p=> <ProjectCard key={p._id} p={p} />)}
        </div>
      </div>
    </section>
  );
}
