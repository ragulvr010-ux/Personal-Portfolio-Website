import React from 'react'

export default function Toast({ toasts }) {
  return (
    <div className="toasts">
      {toasts.map((t) => (
        <div key={t.id} className={`toast ${t.type || 'info'}`}>
          {t.message}
        </div>
      ))}
    </div>
  )
}
