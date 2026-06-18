import React from 'react';

export default function Resume() {
  return (
    <div>
      <h2 className="text-2xl font-bold">Resume</h2>
      <p className="mt-3">You can download the resume below.</p>
      <a className="mt-4 inline-block text-blue-600" href="/resume.pdf" download>Download Resume (PDF)</a>
    </div>
  );
}
