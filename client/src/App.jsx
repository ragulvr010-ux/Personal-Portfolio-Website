import React, { useEffect, useState } from 'react'
import { fetchProjects, createProject, fetchStats, deleteProject, updateProject } from './api'
import { Link, useNavigate } from 'react-router-dom'
import './index.css'
import Toast from './Toast'

function ProjectCard({ p, onEdit, onDelete }) {
  return (
    <div className="card">
      <div className="card-overlay">
        {onEdit && <button className="btn btn-edit" onClick={() => onEdit(p)} title="Edit project">✏️</button>}
        {p.status !== 'Completed' && onEdit && <button className="btn btn-complete" onClick={() => onEdit(p, 'complete')} title="Mark as completed">✅</button>}
        {onDelete && <button className="delete-btn" onClick={() => onDelete(p)} title="Delete project">🗑️</button>}
      </div>
      {p.image ? (
        <img src={(typeof p.image === 'string' && p.image.startsWith('/uploads')) ? (window.location.protocol + '//' + window.location.hostname + ':5000' + p.image) : p.image} alt={p.title} className="card-img" />
      ) : <div className="card-img placeholder" />}
      <div className="card-body">
        <h3>{p.title}</h3>
        <p className="muted">{p.shortDescription || p.description}</p>
        <div className="tags">{(p.tech || []).map((t, i) => <span key={i} className="tag">{t}</span>)}</div>
        <div className="card-footer">
          <span className={`status status-${p.status.toLowerCase()}`}>{p.status}</span>
          {p.repo && <a className="link-btn" href={p.repo} target="_blank" rel="noreferrer">GitHub</a>}
          {p.demo && <a className="link-btn" href={p.demo} target="_blank" rel="noreferrer">Live Demo</a>}
        </div>
        <div className="card-actions">
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const [projects, setProjects] = useState([])
  const [query, setQuery] = useState('')
  const [techFilter, setTechFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [stats, setStats] = useState({})
  const [admin, setAdmin] = useState(!!localStorage.getItem('token'))
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user') || 'null') } catch(e){return null}
  })
  const navigate = useNavigate()
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [toasts, setToasts] = useState([])
  const [confirm, setConfirm] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [filtersApplied, setFiltersApplied] = useState(false)
  const [appliedFilters, setAppliedFilters] = useState({})

  function pushToast(message, type = 'info') {
    const id = Date.now() + Math.random()
    setToasts((t) => [...t, { id, message, type }])
    setTimeout(() => setToasts((t) => t.filter(x => x.id !== id)), 4000)
  }

  useEffect(() => { load(); loadStats(); }, [])
  useEffect(() => {
    const onAuth = () => {
      try { setUser(JSON.parse(localStorage.getItem('user') || 'null')) } catch(e) { setUser(null) }
      setAdmin(!!localStorage.getItem('token'))
    }
    window.addEventListener('authChange', onAuth)
    return () => window.removeEventListener('authChange', onAuth)
  }, [])

  async function load() {
    const q = {}
    if (query) q.q = query
    if (techFilter) q.tech = techFilter
    if (statusFilter) q.status = statusFilter
    console.log('load(): fetching projects with query=', q)
    setLoading(true)
    try {
      const data = await fetchProjects(q)
      console.log('load(): received', Array.isArray(data) ? data.length : 'non-array', 'projects')
      setProjects(data)
      if (!data || data.length === 0) {
        pushToast('No projects match filters', 'info')
      }
    } catch (err) {
      console.error('load() error', err)
      pushToast('Failed to load projects', 'error')
    } finally {
      setLoading(false)
    }
  }

  async function loadStats() {
    const s = await fetchStats()
    setStats(s)
  }

  // legacy inline login removed; use dedicated Login page

  function handleLogout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setAdmin(false)
    setUser(null)
    pushToast('Logged out', 'info')
    navigate('/login')
  }

  async function handleCreate(formEl) {
    // basic validation
    const title = formEl.title.value.trim()
    if (!title) return pushToast('Title is required', 'error')
    // file validation
    const fileInput = formEl.image
    if (fileInput && fileInput.files && fileInput.files[0]) {
      const f = fileInput.files[0]
      const allowed = ['image/png','image/jpeg','image/jpg','image/gif']
      const maxSize = 5 * 1024 * 1024 // 5MB
      if (!allowed.includes(f.type)) return pushToast('Invalid file type. Allowed: PNG/JPG/GIF', 'error')
      if (f.size > maxSize) return pushToast('File too large (max 5MB)', 'error')
    }
    const fd = new FormData()
    fd.append('title', title)
    fd.append('shortDescription', formEl.shortDescription.value || '')
    fd.append('description', formEl.description.value || '')
    const techStr = formEl.tech.value || ''
    const techArr = techStr.split(',').map(s=>s.trim()).filter(Boolean)
    // send as JSON string so backend can parse
    fd.append('tech', JSON.stringify(techArr))
    fd.append('repo', formEl.repo.value || '')
    fd.append('demo', formEl.demo.value || '')
    fd.append('status', formEl.status.value || 'Planned')
    if (fileInput && fileInput.files && fileInput.files[0]) fd.append('image', fileInput.files[0])
    try {
      console.log('handleCreate: submitting form with fields', { title, techArr, status: formEl.status.value })
      const res = await createProject(fd)
      console.log('handleCreate: server response', res)
      setShowForm(false)
      setImagePreview(null)
      load(); loadStats()
      pushToast('Project created', 'success')
    } catch (err) { console.error('handleCreate error', err); pushToast('Create failed: '+err.message, 'error') }
  }

  async function handleDelete(p) {
    setConfirm({ project: p, action: async () => {
      setDeletingId(p._id)
      try {
        await deleteProject(p._id)
        load(); loadStats()
        pushToast('Project deleted', 'success')
      } catch (err) { pushToast('Delete failed: '+(err.message||''), 'error') }
      setDeletingId(null)
      setConfirm(null)
    }} )
  }

  // Triggered by Apply button
  function handleApply() {
    const filters = { q: query, tech: techFilter, status: statusFilter }
    console.log('handleApply(): applying filters', filters)
    setAppliedFilters(filters)
    setFiltersApplied(true)
    load()
  }

  async function handleEdit(formEl, id) {
    const title = formEl.title.value.trim()
    if (!title) return pushToast('Title is required', 'error')
    const fd = new FormData(formEl)
    if (fd.get('tech')) fd.set('tech', JSON.stringify(fd.get('tech').split(',').map(s => s.trim()).filter(Boolean)))
    try {
      await updateProject(id, fd)
      setEditing(null)
      setShowForm(false)
      setImagePreview(null)
      load(); loadStats()
      pushToast('Project updated', 'success')
    } catch (err) { pushToast('Update failed', 'error') }
  }

  // handle overlay actions: edit, complete
  function handleCardAction(p, mode) {
    if (mode === 'complete') {
      // directly mark as completed
      (async () => {
        try {
          const fd = new FormData();
          fd.set('status', 'Completed');
          await updateProject(p._id, fd);
          load(); loadStats();
          pushToast('Marked as completed', 'success');
        } catch (err) { pushToast('Update failed', 'error') }
      })();
    } else {
      setEditing(p)
      setShowForm(true)
    }
  }

  return (
    <div className="app">
      <header className="header">
        <h1>Portfolio Projects</h1>
        <div className="header-actions">
          <div className="stats">
            <div>Total: {stats.total || 0}</div>
            <div>Completed: {stats.completed || 0}</div>
          </div>
          {!admin ? (
            <div style={{display:'flex',gap:8,alignItems:'center'}}>
              <Link to="/login" className="btn">Login</Link>
              <Link to="/register" className="btn">Register</Link>
            </div>
          ) : (
            <div style={{display:'flex',gap:8,alignItems:'center'}}>
              <div style={{color:'var(--muted)',marginRight:8}}>Hello, {user?.name || 'Admin'}</div>
              <button className="btn" onClick={() => { setShowForm(true); setEditing(null); }}>Add Project</button>
              <button className="btn" onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      </header>

      <div className="controls">
        <input placeholder="Search..." value={query} onChange={(e) => setQuery(e.target.value)} />
        <input placeholder="Filter tech" value={techFilter} onChange={(e) => setTechFilter(e.target.value)} />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All</option>
          <option>Completed</option>
          <option>Ongoing</option>
          <option>Planned</option>
        </select>
        <button className={`btn ${filtersApplied ? 'applied' : ''}`} onClick={handleApply} disabled={loading}>{loading ? 'Applying...' : (filtersApplied ? 'Applied' : 'Apply')}</button>
      </div>

      <main className="grid">
        {projects.map(p => (
          <ProjectCard key={p._id} p={p} onEdit={admin ? ((proj, mode) => handleCardAction(proj, mode)) : null} onDelete={admin ? handleDelete : null} />
        ))}
      </main>
      {(!loading && projects.length === 0) && (
        <div className="empty">No projects found matching the current filters.</div>
      )}

      {showForm && (
        <div className="modal">
          <div className="modal-content">
            <h2>{editing ? 'Edit Project' : 'Add Project'}</h2>
            <form onSubmit={(e) => { e.preventDefault(); if (editing) handleEdit(e.target, editing._id); else handleCreate(e.target); }}>
              <input name="title" defaultValue={editing?.title || ''} placeholder="Project Title" required />
              <input name="shortDescription" defaultValue={editing?.shortDescription || ''} placeholder="Short description" />
              <textarea name="description" defaultValue={editing?.description || ''} placeholder="Long description" />
              <input name="tech" defaultValue={(editing?.tech || []).join(',')} placeholder="Comma-separated tech" />
              <input name="repo" defaultValue={editing?.repo || ''} placeholder="GitHub repo URL" />
              <input name="demo" defaultValue={editing?.demo || ''} placeholder="Live demo URL" />
              <select name="status" defaultValue={editing?.status || 'Planned'}>
                <option value="Completed">Completed</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Planned">Planned</option>
              </select>
              <div style={{display:'flex',gap:8,alignItems:'center'}}>
                <label htmlFor="imageInput" className="btn">Choose file</label>
                <input id="imageInput" className="file-hidden" type="file" name="image" onChange={(e)=>{const f=e.target.files&&e.target.files[0]; if(f){const url=URL.createObjectURL(f); setImagePreview(url)} else setImagePreview(null)}} />
                {imagePreview && <img src={imagePreview} alt="preview" style={{height:60,borderRadius:6}} />}
              </div>
              <div className="modal-actions">
                <button type="submit">Save</button>
                <button type="button" onClick={() => { setShowForm(false); setEditing(null); }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {confirm && (
        <div className="modal">
          <div className="modal-content">
            <h3>Confirm delete</h3>
            <p>Are you sure you want to delete "{confirm.project.title}"?</p>
            <div style={{display:'flex',gap:8,justifyContent:'flex-end'}}>
              <button className="btn" onClick={()=>setConfirm(null)}>Cancel</button>
              <button className="btn btn-delete" onClick={confirm.action} disabled={!!deletingId}>{deletingId ? 'Deleting...' : 'Delete'}</button>
            </div>
          </div>
        </div>
      )}
      <Toast toasts={toasts} />
    </div>
  )
}
