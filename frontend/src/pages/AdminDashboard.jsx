import React, { useEffect, useState } from 'react';
import api from '../api';
import ProjectCard from '../components/ProjectCard';

export default function AdminDashboard() {
  const [projects, setProjects] = useState([]);
  const [messages, setMessages] = useState([]);
  const [active, setActive] = useState('projects');

  const load = async () => {
    try {
      const [pRes, mRes] = await Promise.all([api.get('/api/projects'), api.get('/api/contact')]);
      setProjects(pRes.data);
      setMessages(mRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(()=>{ load(); }, []);

  const deleteProject = async id => {
    if (!confirm('Delete project?')) return;
    await api.delete('/api/projects/' + id);
    setProjects(projects.filter(p=>p._id!==id));
  };

  const deleteMessage = async id => {
    if (!confirm('Delete message?')) return;
    await api.delete('/api/contact/' + id).catch(()=>{});
    setMessages(messages.filter(m=>m._id!==id));
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>
      <div className="grid md:grid-cols-4 gap-6">
        <aside className="md:col-span-1 bg-white/60 dark:bg-black/60 p-4 rounded shadow">
          <nav className="flex flex-col gap-3">
            <button onClick={()=>setActive('projects')} className={"text-left " + (active==='projects'?'font-semibold':'')}>Projects</button>
            <button onClick={()=>setActive('messages')} className={"text-left " + (active==='messages'?'font-semibold':'')}>Messages</button>
          </nav>
        </aside>

        <div className="md:col-span-3">
          {active==='projects' && (
            <section className="mb-6">
              <h3 className="font-semibold mb-2">Projects</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {projects.map(p=> <ProjectCard key={p._id} project={p} onDelete={deleteProject} />)}
              </div>
            </section>
          )}

          {active==='messages' && (
            <section>
              <h3 className="font-semibold mb-2">Messages</h3>
              <div className="space-y-3">
                {messages.map(m=> (
                  <div key={m._id} className="border p-3 rounded">
                    <div className="flex justify-between"><div><strong>{m.name}</strong> — {m.email}</div><button className="text-red-600" onClick={()=>deleteMessage(m._id)}>Delete</button></div>
                    <div className="mt-2">{m.message}</div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
