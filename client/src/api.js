function authHeader() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: 'Bearer ' + token } : {};
}

export async function fetchProjects(query = {}) {
  const qs = new URLSearchParams(query).toString();
  const res = await fetch('/api/projects' + (qs ? `?${qs}` : ''));
  if (!res.ok) return [];
  return res.json();
}

export async function fetchStats() {
  const res = await fetch('/api/projects/stats/all');
  if (!res.ok) return {};
  return res.json();
}

export async function login(username, password) {
  // Try server first, fallback to localStorage dev users if server unavailable
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: username, password })
    });
    if (res.ok) return res.json();
    // if server returns 4xx/5xx, try local fallback
    console.warn('Server login failed, falling back to local auth', res.status);
  } catch (err) {
    console.warn('Server login request failed, using local auth fallback', err);
  }

  // Local dev auth: check users in localStorage
  const users = JSON.parse(localStorage.getItem('dev_users') || '[]');
  const user = users.find(u => u.email === String(username).toLowerCase());
  if (!user) throw new Error('No account found (dev local)');
  if (user.password !== password) throw new Error('Invalid credentials (dev local)');
  // generate a simple dev token
  const token = `dev-${Date.now()}-${Math.random().toString(36).slice(2,8)}`;
  return { token, user: { name: user.name, email: user.email } };
}

export async function register(name, email, password) {
  // Try server register first, fallback to localStorage dev users
  try {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    if (res.ok) return res.json();
    console.warn('Server register failed, falling back to local register', res.status);
  } catch (err) {
    console.warn('Server register request failed, using local register fallback', err);
  }

  // Local dev register: store user in localStorage (password stored in plain for dev only)
  const key = 'dev_users';
  const users = JSON.parse(localStorage.getItem(key) || '[]');
  const normalized = String(email).toLowerCase();
  if (users.find(u => u.email === normalized)) throw new Error('Account already exists (dev local)');
  const user = { name, email: normalized, password };
  users.push(user);
  localStorage.setItem(key, JSON.stringify(users));
  const token = `dev-${Date.now()}-${Math.random().toString(36).slice(2,8)}`;
  console.log('Registered local dev user', normalized);
  return { token, user: { name, email: normalized } };
}

export async function createProject(formData) {
  const res = await fetch('/api/projects', {
    method: 'POST',
    headers: { ...authHeader() },
    body: formData
  });
  const payload = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = payload && (payload.message || (payload.errors && payload.errors.map(e=>e.msg).join(', '))) || `Create failed (${res.status})`;
    throw new Error(msg);
  }
  return payload;
}

export async function updateProject(id, formData) {
  const res = await fetch(`/api/projects/${id}`, {
    method: 'PUT',
    headers: { ...authHeader() },
    body: formData
  });
  const payload = await res.json().catch(()=>({}));
  if (!res.ok) {
    const msg = payload && (payload.message || 'Update failed')
    throw new Error(msg)
  }
  return payload;
}

export async function deleteProject(id) {
  const res = await fetch(`/api/projects/${id}`, {
    method: 'DELETE',
    headers: { ...authHeader() }
  });
  const payload = await res.json().catch(()=>({}));
  if (!res.ok) throw new Error(payload.message || 'Delete failed');
  return payload;
}
