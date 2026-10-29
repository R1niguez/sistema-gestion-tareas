import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

test('Voltio Lab expone catálogo, carrito y acceso administrativo', () => {
  const source = fs.readFileSync('src/main.js', 'utf8');
  assert.match(source, /Voltio Lab|voltiolab/i);
  assert.match(source, /addToCart/);
  assert.match(source, /checkout/);
  assert.match(source, /admin/);
});
