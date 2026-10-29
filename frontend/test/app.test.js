import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

test('Voltio Lab expone catálogo, carrito y acceso administrativo', () => {
  const source = fs.readFileSync('src/main.js', 'utf8');
  assert.match(source, /Voltio Lab|voltiolab/i);
  assert.match(source, /addToCart/);
  assert.match(source, /checkout/);
  assert.match(source, /admin/);
  assert.match(source, /data-login-form/);
  assert.match(source, /state\.admin \?/);
  assert.match(source, /contactView/);
  assert.match(source, /data-product-form/);
  assert.match(source, /¿Está seguro de eliminar/);
  assert.match(source, /data-edit/);
  assert.doesNotMatch(source, /Mi cuenta/);
  assert.match(source, /state\.products = await request\('\/admin\/products'\)/);
});
