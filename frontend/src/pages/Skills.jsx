import React from 'react';

const skills = [
  ['HTML', 90],
  ['CSS', 85],
  ['JavaScript', 80],
  ['React', 75],
  ['Node.js', 70],
  ['MongoDB', 70]
];

export default function Skills() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Skills</h2>
      <div className="space-y-3">
        {skills.map(s => (
          <div key={s[0]}>
            <div className="flex justify-between text-sm"><span>{s[0]}</span><span>{s[1]}%</span></div>
            <div className="h-2 bg-gray-200 rounded mt-1"><div className="h-2 bg-blue-600 rounded" style={{width: `${s[1]}%`}} /></div>
          </div>
        ))}
      </div>
    </div>
  );
}
