import React from 'react';
import { motion } from 'framer-motion';
import LazyImage from './LazyImage';

function Typewriter({ words, speed=120, deleteSpeed=60, delay=1500 }){
  const [text, setText] = React.useState('');
  const [wordIndex, setWordIndex] = React.useState(0);
  const [deleting, setDeleting] = React.useState(false);

  React.useEffect(()=>{
    let timer;
    const current = words[wordIndex % words.length];
    if (!deleting) {
      timer = setTimeout(()=> setText(current.slice(0, text.length+1)), speed);
      if (text === current) timer = setTimeout(()=>setDeleting(true), delay);
    } else {
      timer = setTimeout(()=> setText(current.slice(0, text.length-1)), deleteSpeed);
      if (text === '') { setDeleting(false); setWordIndex(i=>i+1); }
    }
    return ()=> clearTimeout(timer);
  }, [text, deleting, wordIndex, words, speed, deleteSpeed, delay]);
  return <span>{text}<span className="blink">|</span></span>;
}

export default function Hero() {
  return (
    <section id="home" className="min-h-screen flex items-center" style={{background: 'linear-gradient(135deg,#0f172a 0%, #0ea5a7 60%)'}}>
      <div className="max-w-6xl mx-auto p-6 flex flex-col-reverse md:flex-row items-center gap-8">
        <div className="flex-1 text-white">
          <h1 className="text-4xl md:text-6xl font-extrabold">Hi, I'm Ragul</h1>
          <div className="mt-3 text-xl md:text-2xl">
            <span className="mr-2">I'm a</span>
            <span className="font-medium">
              <Typewriter words={["Full Stack Developer.", "MERN Stack Engineer.", "UI/UX Enthusiast."]} speed={80} deleteSpeed={40} delay={1500} />
            </span>
          </div>
          <p className="mt-4 max-w-xl text-white/90">I build modern, performant web applications with great UX. I focus on React, Node.js and scalable backend systems.</p>
          <div className="mt-6 flex gap-4">
            <a href="#projects" className="px-5 py-3 bg-white text-teal-700 rounded shadow">View Projects</a>
            <a href="/resume.pdf" download className="px-5 py-3 border border-white/30 text-white rounded">Download Resume</a>
          </div>
        </div>
        <motion.div className="w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden shadow-2xl" initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
          <LazyImage src="/profile.jpg" alt="Profile" />
        </motion.div>
      </div>
    </section>
  );
}
