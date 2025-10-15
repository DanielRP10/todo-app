import { loadTasks, addTask, toggleTask, deleteTask, updateTask } from './app.js';

const tbody = document.getElementById('tbody');
const form = document.getElementById('form');

async function refresh() {
  const tasks = await loadTasks();
  tbody.innerHTML = tasks.map(t => `
    <tr data-id="${t.id}" class="${t.completed ? 'tr-done' : ''}">
      <td>${t.id}</td>
      <td class="title-cell">${t.title}</td>
      <td class="desc-cell">${t.description || ''}</td>
      <td><span class="badge ${t.completed ? 'done' : 'todo'}">${t.completed ? 'Completada' : 'Pendiente'}</span></td>
      <td class="actions">
        <button data-action="toggle" data-id="${t.id}" data-completed="${!t.completed}">
          ${t.completed ? 'Desmarcar' : 'Completar'}
        </button>
        <button data-action="edit" data-id="${t.id}">Editar</button>
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
  } 
  else if (action === 'delete') {
    await deleteTask(id);
  } 
  else if (action === 'edit') {
    startEdit(btn.closest('tr'));
    return;
  } 
  else if (action === 'save') {
    await saveEdit(btn.closest('tr'));
    return;
  } 
  else if (action === 'cancel') {
    cancelEdit(btn.closest('tr'));
    return;
  }

  refresh();
});

function startEdit(tr) {
  const titleCell = tr.querySelector('.title-cell');
  const descCell = tr.querySelector('.desc-cell');
  const title = titleCell.textContent.trim();
  const desc = descCell.textContent.trim();

  titleCell.innerHTML = `<input type="text" value="${title}" />`;
  descCell.innerHTML = `<input type="text" value="${desc}" />`;

  const actionsCell = tr.querySelector('.actions');
  actionsCell.innerHTML = `
    <button data-action="save" data-id="${tr.dataset.id}">Guardar</button>
    <button data-action="cancel" data-id="${tr.dataset.id}">Cancelar</button>
  `;

  tr.classList.add('editing');
}

async function saveEdit(tr) {
  const id = Number(tr.dataset.id);
  const title = tr.querySelector('.title-cell input').value.trim();
  const description = tr.querySelector('.desc-cell input').value.trim();

  if (!title) {
    alert('El título no puede estar vacío');
    return;
  }

  await updateTask(id, { title, description });
  await refresh();
}

function cancelEdit(tr) {
  refresh();
}

refresh();
