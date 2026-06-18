import React, { useState } from 'react';
import api from '../api';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState(null);

  const submit = async e => {
    e.preventDefault();
    try {
      await api.post('/api/contact', form);
      setStatus('Sent');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setStatus('Error');
    }
  };

  return (
    <div className="max-w-lg">
      <h2 className="text-2xl font-bold mb-4">Contact</h2>
      <form onSubmit={submit} className="space-y-3">
        <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Name" className="w-full border p-2" required />
        <input value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="Email" className="w-full border p-2" required />
        <input value={form.subject} onChange={e=>setForm({...form,subject:e.target.value})} placeholder="Subject" className="w-full border p-2" />
        <textarea value={form.message} onChange={e=>setForm({...form,message:e.target.value})} placeholder="Message" className="w-full border p-2" required />
        <button className="px-4 py-2 bg-blue-600 text-white">Send</button>
      </form>
      {status && <div className="mt-3">{status}</div>}
    </div>
  );
}
