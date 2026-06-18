import React, { useState } from 'react';
import { motion } from 'framer-motion';

const sample = [
  { id:1, title:'Full Stack Certificate', image:'/cert1.jpg' },
  { id:2, title:'React Advanced', image:'/cert2.jpg' }
];

export default function CertificationsSection(){
  const [open, setOpen] = useState(null);
  return (
    <section id="certs" className="py-16">
      <div className="max-w-5xl mx-auto p-4">
        <h2 className="text-2xl font-bold mb-6">Certifications</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {sample.map(c=> (
            <div key={c.id} className="bg-white/60 dark:bg-black/60 p-3 rounded shadow">
              <h4 className="font-semibold">{c.title}</h4>
              <div className="mt-3 flex gap-2">
                <button onClick={()=>setOpen(c)} className="text-blue-600">Preview</button>
                <a href={c.image} download className="text-blue-600">Download</a>
              </div>
            </div>
          ))}
        </div>

        {open && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
            <div className="bg-white p-4 rounded max-w-3xl w-full">
              <div className="flex justify-between"><h3>{open.title}</h3><button onClick={()=>setOpen(null)}>Close</button></div>
              <img src={open.image} alt={open.title} className="mt-3 w-full h-96 object-contain" />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
