const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

test('la API NestJS define las rutas requeridas', () => {
  const source = fs.readFileSync('src/app.controller.ts', 'utf8');
  for (const route of ['products', 'login', 'admin/products', 'admin/orders', 'checkout']) {
    assert.match(source, new RegExp(route.replace('/', '\\/')));
  }
});

test('la aplicación usa PostgreSQL mediante DATABASE_URL', () => {
  assert.match(fs.readFileSync('src/database.service.ts', 'utf8'), /DATABASE_URL/);
  assert.match(fs.readFileSync('database.sql', 'utf8'), /CREATE TABLE IF NOT EXISTS products/);
});
