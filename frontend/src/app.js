const API_URL = 'http://localhost:3000';

export async function loadTasks() {
  const r = await fetch(`${API_URL}/tasks`);
  if (!r.ok) throw new Error('Error al cargar tareas');
  return r.json();
}

export async function addTask({ title, description = '' }) {
  const r = await fetch(`${API_URL}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, description })
  });
  if (!r.ok) throw new Error('Error al crear tarea');
  return r.json();
}

export async function toggleTask(id, completed) {
  const r = await fetch(`${API_URL}/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ completed })
  });
  if (!r.ok) throw new Error('Error al actualizar tarea');
  return r.json();
}

export async function updateTask(id, data) {
  const r = await fetch(`${API_URL}/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!r.ok) throw new Error('Error al editar tarea');
  return r.json();
}

export async function deleteTask(id) {
  const r = await fetch(`${API_URL}/tasks/${id}`, { method: 'DELETE' });
  if (!r.ok && r.status !== 204) throw new Error('Error al eliminar tarea');
  return true;
}
