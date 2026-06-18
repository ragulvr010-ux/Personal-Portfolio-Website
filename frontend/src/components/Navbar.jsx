import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HiMenu, HiX } from 'react-icons/hi';
import clsx from 'clsx';
import { motion } from 'framer-motion';

const links = [
  { to: '#home', label: 'Home' },
  { to: '#about', label: 'About' },
  { to: '#skills', label: 'Skills' },
  { to: '#projects', label: 'Projects' },
  { to: '#certs', label: 'Certifications' },
  { to: '#contact', label: 'Contact' }
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('#home');

  useEffect(() => {
    const onScroll = () => {
      const sections = links.map(l => document.querySelector(l.to));
      let current = '#home';
      sections.forEach((s, i) => {
        if (!s) return;
        const top = s.getBoundingClientRect().top;
        if (top <= 120) current = links[i].to;
      });
      setActive(current);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.header initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="sticky top-0 z-50 backdrop-blur bg-white/30 dark:bg-black/30 border-b border-white/10">
      <div className="max-w-6xl mx-auto flex items-center justify-between p-4">
        <div className="text-lg font-semibold">Ragul</div>
        <nav className="hidden md:flex gap-6 items-center">
          {links.map(l => (
            <a key={l.to} href={l.to} className={clsx('hover:text-primary', active===l.to && 'text-primary')}>{l.label}</a>
          ))}
          <a href="#" className="ml-4 px-3 py-1 rounded bg-gradient-to-r from-primary to-indigo-400 text-white">Contact</a>
        </nav>
        <div className="md:hidden">
          <button onClick={()=>setOpen(true)} aria-label="Open menu"><HiMenu size={24} /></button>
        </div>
      </div>

      {open && (
        <div className="md:hidden fixed inset-0 bg-black/40">
          <div className="absolute right-0 top-0 w-64 h-full bg-white dark:bg-gray-900 p-4">
            <div className="flex justify-end"><button onClick={()=>setOpen(false)}><HiX size={24} /></button></div>
            <div className="mt-6 flex flex-col gap-4">
              {links.map(l => <a key={l.to} href={l.to} onClick={()=>setOpen(false)} className={clsx(active===l.to && 'text-primary')}>{l.label}</a>)}
            </div>
          </div>
        </div>
      )}
    </motion.header>
  );
}
