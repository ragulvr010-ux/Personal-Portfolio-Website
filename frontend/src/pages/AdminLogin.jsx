import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin() {
  const [form, setForm] = useState({ email: '', password: '' });
  const nav = useNavigate();

  const submit = async e => {
    e.preventDefault();
    try {
      const res = await api.post('/api/auth/login', form);
      localStorage.setItem('token', res.data.token);
      nav('/admin');
    } catch (err) {
      alert('Login failed');
    }
  };

  return (
    <div className="max-w-sm">
      <h2 className="text-2xl font-bold mb-4">Admin Login</h2>
      <form onSubmit={submit} className="space-y-3">
        <input value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="Email" className="w-full border p-2" required />
        <input type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} placeholder="Password" className="w-full border p-2" required />
        <button className="px-4 py-2 bg-blue-600 text-white">Login</button>
      </form>
    </div>
  );
}
