import React from 'react';

export default function ResumeSection(){
  return (
    <section id="resume" className="py-16">
      <div className="max-w-5xl mx-auto p-4">
        <h2 className="text-2xl font-bold mb-3">Resume</h2>
        <div className="bg-white/60 dark:bg-black/60 p-4 rounded shadow">
          <iframe title="Resume" src="/resume.pdf" className="w-full h-[600px]" />
          <div className="mt-3"><a href="/resume.pdf" download className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-teal-400 text-white rounded">Download PDF</a></div>
        </div>
      </div>
    </section>
  );
}
