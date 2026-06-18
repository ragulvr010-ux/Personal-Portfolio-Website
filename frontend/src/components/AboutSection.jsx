import React from 'react';
import { motion } from 'framer-motion';

export default function AboutSection(){
  return (
    <section id="about" className="py-16">
      <div className="max-w-5xl mx-auto p-4">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-white/60 dark:bg-black/60 backdrop-blur rounded-lg p-6 shadow">
          <h2 className="text-2xl font-bold mb-3">About Me</h2>
          <div className="md:flex gap-6">
            <div className="md:w-1/3">
              <div className="p-4 bg-gradient-to-br from-white/40 to-white/10 rounded-lg">
                <h3 className="font-semibold">Profile</h3>
                <p className="mt-2 text-sm">Full Stack Developer focused on building accessible and performant web apps.</p>
              </div>
            </div>
            <div className="md:flex-1 mt-4 md:mt-0">
              <h4 className="font-semibold">Education</h4>
              <ul className="mt-2 list-disc ml-5">
                <li>B.Tech, Information Technology — University Name (Year)</li>
              </ul>

              <h4 className="font-semibold mt-4">Experience</h4>
              <ul className="mt-2">
                <li className="mb-2">Software Engineer — Company (Year–Present)</li>
                <li>Intern — Company (Year–Year)</li>
              </ul>

              <h4 className="font-semibold mt-4">Introduction</h4>
              <p className="mt-2">I enjoy crafting delightful user experiences and robust backend services. I care about code quality and teamwork.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
