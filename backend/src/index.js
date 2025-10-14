import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import pg from 'pg';

const {
  PORT = 3000,
  DB_HOST = 'localhost',
  DB_USER = 'todo',
  DB_PASSWORD = 'todo',
  DB_NAME = 'todoapp',
  DB_PORT = '5432'
} = process.env;

const pool = new pg.Pool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  port: Number(DB_PORT)
});

async function ensureSchema() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS tasks (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT DEFAULT '',
      completed BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);
}

const app = express();
app.use(cors());
app.use(express.json());

// Salud
app.get('/health', (_req, res) => res.json({ ok: true }));

// Asegurar tabla al iniciar
await ensureSchema();

// GET /tasks
app.get('/tasks', async (_req, res) => {
  const { rows } = await pool.query(
    'SELECT id, title, description, completed, created_at FROM tasks ORDER BY id ASC;'
  );
  res.json(rows); // 200
});

// POST /tasks
app.post('/tasks', async (req, res) => {
  const { title, description = '' } = req.body || {};
  if (!title) return res.status(400).json({ error: 'title requerido' });

  const { rows } = await pool.query(
    'INSERT INTO tasks (title, description) VALUES ($1, $2) RETURNING id, title, description, completed, created_at;',
    [title, description]
  );
  res.status(201).json(rows[0]); // 201 Created
});

// PUT /tasks/:id
app.put('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const { completed, title, description } = req.body || {};

  const sets = [];
  const values = [];
  let i = 1;

  if (typeof completed === 'boolean') { sets.push(`completed = $${i++}`); values.push(completed); }
  if (typeof title === 'string')       { sets.push(`title = $${i++}`);     values.push(title); }
  if (typeof description === 'string') { sets.push(`description = $${i++}`); values.push(description); }

  if (!sets.length) return res.status(400).json({ error: 'ningún campo para actualizar' });

  values.push(id);
  const sql = `UPDATE tasks SET ${sets.join(', ')} WHERE id = $${i} RETURNING id, title, description, completed, created_at;`;
  const { rows } = await pool.query(sql, values);
  if (!rows.length) return res.status(404).json({ error: 'task no encontrada' });

  res.json(rows[0]); // 200
});

// DELETE /tasks/:id
app.delete('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const r = await pool.query('DELETE FROM tasks WHERE id = $1;', [id]);
  if (r.rowCount === 0) return res.status(404).json({ error: 'task no encontrada' });
  res.status(204).end(); // 204 No Content
});

app.listen(PORT, () => {
  console.log(`API on http://localhost:${PORT}`);
});
