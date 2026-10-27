const test = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const { app } = require('../index');

test('rechaza la creación de una tarea sin título', async () => {
  const respuesta = await request(app)
    .post('/api/tareas')
    .send({ descripcion: 'Sin título' });

  assert.equal(respuesta.status, 400);
  assert.match(respuesta.body.error, /título/i);
});

test('rechaza un estado que no está permitido', async () => {
  const respuesta = await request(app)
    .post('/api/tareas')
    .send({ titulo: 'Tarea', estado: 'desconocido' });

  assert.equal(respuesta.status, 400);
  assert.match(respuesta.body.error, /estado/i);
});

test('rechaza identificadores inválidos', async () => {
  const respuesta = await request(app).get('/api/tareas/no-es-un-id');

  assert.equal(respuesta.status, 400);
});
