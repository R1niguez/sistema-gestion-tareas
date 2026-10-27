const tseslint = require('typescript-eslint');
const angular = require('@angular-eslint/eslint-plugin');
const parser = require('@typescript-eslint/parser');

module.exports = tseslint.config(
  { files: ['**/*.ts'], languageOptions: { parser }, plugins: { '@angular-eslint': angular }, rules: { '@angular-eslint/component-class-suffix': 'error' } },
);
