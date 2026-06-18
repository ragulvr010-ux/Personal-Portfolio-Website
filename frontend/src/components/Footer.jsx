import React from 'react';

export default function Footer(){
  return (
    <footer className="py-8">
      <div className="max-w-6xl mx-auto text-center text-sm text-gray-500">© {new Date().getFullYear()} Ragul — Built with React & Tailwind</div>
    </footer>
  );
}
