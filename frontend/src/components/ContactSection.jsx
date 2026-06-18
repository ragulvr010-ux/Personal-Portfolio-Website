import React from 'react';
import { useForm } from 'react-hook-form';
import api from '../api';

export default function ContactSection(){
  const { register, handleSubmit, formState:{errors}, reset } = useForm();
  const onSubmit = async data => {
    try {
      await api.post('/api/contact', data);
      alert('Message sent');
      reset();
    } catch (err) { alert('Failed to send'); }
  };

  return (
    <section id="contact" className="py-16">
      <div className="max-w-3xl mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">Contact</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white/60 dark:bg-black/60 p-6 rounded shadow space-y-3">
          <input {...register('name',{required:true})} placeholder="Name" className="w-full p-2 border" />
          {errors.name && <div className="text-red-600">Name required</div>}
          <input {...register('email',{required:true,pattern:/^\S+@\S+$/i})} placeholder="Email" className="w-full p-2 border" />
          {errors.email && <div className="text-red-600">Valid email required</div>}
          <input {...register('subject')} placeholder="Subject" className="w-full p-2 border" />
          <textarea {...register('message',{required:true})} placeholder="Message" className="w-full p-2 border" />
          {errors.message && <div className="text-red-600">Message required</div>}
          <button type="submit" className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-teal-400 text-white rounded">Send Message</button>
        </form>
        <div className="mt-4 flex gap-3">
          <a href="https://github.com/" className="text-gray-600">GitHub</a>
          <a href="https://linkedin.com/" className="text-gray-600">LinkedIn</a>
        </div>
      </div>
    </section>
  );
}
