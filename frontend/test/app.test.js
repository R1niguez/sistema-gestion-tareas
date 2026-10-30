import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

test('Voltio Lab conserva sus flujos principales en Angular standalone', () => {
  const component = fs.readFileSync('src/app.component.ts', 'utf8');
  const template = fs.readFileSync('src/app.component.html', 'utf8');
  const service = fs.readFileSync('src/product.service.ts', 'utf8');
  assert.match(component, /standalone: true/);
  assert.match(component, /addToCart/);
  assert.match(component, /checkout/);
  assert.match(component, /admin/);
  assert.match(component, /voltio-admin-token/);
  assert.match(component, /String\(item\.id\) === String\(this\.editingId\)/);
  assert.match(template, /Iniciar sesión/);
  assert.match(component, /¿Está seguro de eliminar/);
  assert.doesNotMatch(template, /Mi cuenta/);
  assert.match(service, /HttpClient/);
  assert.match(service, /admin\/products/);
});
