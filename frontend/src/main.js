import { loadTasks, addTask, toggleTask, deleteTask } from './app.js';

const tbody = document.getElementById('tbody');
const form = document.getElementById('form');

async function refresh() {
  const tasks = await loadTasks();
  tbody.innerHTML = tasks.map(t => `
    <tr class="${t.completed ? 'tr-done' : ''}">
      <td>${t.id}</td>
      <td>${t.title}</td>
      <td>${t.description || ''}</td>
      <td><span class="badge ${t.completed ? 'done' : 'todo'}">${t.completed ? 'Completada' : 'Pendiente'}</span></td>
      <td class="actions">
        <button data-action="toggle" data-id="${t.id}" data-completed="${!t.completed}">${t.completed ? 'Desmarcar' : 'Completar'}</button>
        <button data-action="delete" data-id="${t.id}">Eliminar</button>
      </td>
    </tr>
  `).join('');
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = document.getElementById('title').value.trim();
  const description = document.getElementById('description').value.trim();
  if (!title) return;
  await addTask({ title, description });
  form.reset();
  refresh();
});

tbody.addEventListener('click', async (e) => {
  const btn = e.target.closest('button');
  if (!btn) return;
  const action = btn.dataset.action;
  const id = Number(btn.dataset.id);
  if (action === 'toggle') {
    const completed = btn.dataset.completed === 'true';
    await toggleTask(id, completed);
  } else if (action === 'delete') {
    await deleteTask(id);
  }
  refresh();
});

refresh();
