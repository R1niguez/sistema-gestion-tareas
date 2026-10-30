import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

test('la aplicación mantiene la estructura Angular requerida', () => {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const angular = fs.readFileSync('angular.json', 'utf8');
  assert.ok(packageJson.dependencies['@angular/core']);
  assert.ok(packageJson.dependencies['@angular/common']);
  assert.match(angular, /@angular-devkit\/build-angular:application/);
});
