require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = Number(process.env.PORT) || 3000;

const pool = new Pool({
  host: process.env.PGHOST || 'localhost',
  port: Number(process.env.PGPORT) || 5432,
  database: process.env.PGDATABASE || 'sistema_tareas',
  user: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD,
});

const estadosValidos = new Set(['pendiente', 'en progreso', 'completada']);

app.use(cors());
app.use(express.json());

app.get('/health', async (_req, res, next) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok' });
  } catch (error) {
    next(error);
  }
});

function validarTarea(body) {
  const datos = body || {};
  const titulo = typeof datos.titulo === 'string' ? datos.titulo.trim() : '';
  const descripcion =
    datos.descripcion === undefined || datos.descripcion === null
      ? ''
      : String(datos.descripcion).trim();
  const estado = datos.estado === undefined ? 'pendiente' : datos.estado;

  if (!titulo || titulo.length > 150) {
    return 'El título es obligatorio y debe tener entre 1 y 150 caracteres.';
  }
  if (typeof estado !== 'string' || !estadosValidos.has(estado)) {
    return 'El estado debe ser: pendiente, en progreso o completada.';
  }

  return { titulo, descripcion, estado };
}

function obtenerId(parametro) {
  const id = Number(parametro);
  return Number.isInteger(id) && id > 0 ? id : null;
}

app.get('/api/tareas', async (_req, res, next) => {
  try {
    const resultado = await pool.query(
      'SELECT id, titulo, descripcion, estado FROM tareas ORDER BY id ASC'
    );
    res.json(resultado.rows);
  } catch (error) {
    next(error);
  }
});

app.get('/api/tareas/:id', async (req, res, next) => {
  const id = obtenerId(req.params.id);
  if (id === null) {
    return res.status(400).json({ error: 'El identificador debe ser un entero positivo.' });
  }

  try {
    const resultado = await pool.query(
      'SELECT id, titulo, descripcion, estado FROM tareas WHERE id = $1',
      [id]
    );
    if (resultado.rowCount === 0) {
      return res.status(404).json({ error: 'Tarea no encontrada.' });
    }
    return res.json(resultado.rows[0]);
  } catch (error) {
    return next(error);
  }
});

app.post('/api/tareas', async (req, res, next) => {
  const tarea = validarTarea(req.body);
  if (typeof tarea === 'string') {
    return res.status(400).json({ error: tarea });
  }

  try {
    const resultado = await pool.query(
      'INSERT INTO tareas (titulo, descripcion, estado) VALUES ($1, $2, $3) RETURNING id, titulo, descripcion, estado',
      [tarea.titulo, tarea.descripcion, tarea.estado]
    );
    return res.status(201).json(resultado.rows[0]);
  } catch (error) {
    return next(error);
  }
});

app.put('/api/tareas/:id', async (req, res, next) => {
  const id = obtenerId(req.params.id);
  if (id === null) {
    return res.status(400).json({ error: 'El identificador debe ser un entero positivo.' });
  }
  const tarea = validarTarea(req.body);
  if (typeof tarea === 'string') {
    return res.status(400).json({ error: tarea });
  }

  try {
    const resultado = await pool.query(
      'UPDATE tareas SET titulo = $1, descripcion = $2, estado = $3 WHERE id = $4 RETURNING id, titulo, descripcion, estado',
      [tarea.titulo, tarea.descripcion, tarea.estado, id]
    );
    if (resultado.rowCount === 0) {
      return res.status(404).json({ error: 'Tarea no encontrada.' });
    }
    return res.json(resultado.rows[0]);
  } catch (error) {
    return next(error);
  }
});

app.delete('/api/tareas/:id', async (req, res, next) => {
  const id = obtenerId(req.params.id);
  if (id === null) {
    return res.status(400).json({ error: 'El identificador debe ser un entero positivo.' });
  }

  try {
    const resultado = await pool.query('DELETE FROM tareas WHERE id = $1', [id]);
    if (resultado.rowCount === 0) {
      return res.status(404).json({ error: 'Tarea no encontrada.' });
    }
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
});

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ error: 'Ocurrió un error interno del servidor.' });
});

if (require.main === module) {
  app.listen(port, () => {
    console.log(`API de tareas ejecutándose en http://localhost:${port}`);
  });
}

module.exports = { app, pool };
