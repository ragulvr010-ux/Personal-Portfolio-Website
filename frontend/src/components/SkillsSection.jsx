import React from 'react';
import { motion } from 'framer-motion';

const skills = {
  Frontend: [{name:'HTML', val:90},{name:'CSS', val:85},{name:'React', val:80}],
  Backend: [{name:'Node.js', val:75},{name:'Express', val:72}],
  Database: [{name:'MongoDB', val:70}],
  Tools: [{name:'Git', val:80},{name:'Docker', val:60}]
};

function Bar({name, val}){
  return (
    <div className="mb-3">
      <div className="flex justify-between text-sm"><span>{name}</span><span>{val}%</span></div>
      <div className="h-2 bg-gray-200 rounded mt-1 overflow-hidden"><motion.div initial={{width:0}} whileInView={{width: `${val}%`}} className="h-2 bg-gradient-to-r from-indigo-500 to-teal-400 rounded" viewport={{once:true}} /></div>
    </div>
  );
}

export default function SkillsSection(){
  return (
    <section id="skills" className="py-16">
      <div className="max-w-5xl mx-auto p-4">
        <h2 className="text-2xl font-bold mb-6">Skills</h2>
        <div className="grid md:grid-cols-4 gap-6">
          {Object.keys(skills).map(cat => (
            <div key={cat} className="bg-white/60 dark:bg-black/60 p-4 rounded-lg shadow">
              <h3 className="font-semibold mb-3">{cat}</h3>
              {skills[cat].map(s => <Bar key={s.name} name={s.name} val={s.val} />)}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
