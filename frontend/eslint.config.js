export default [{
  files: ['src/**/*.js'],
  languageOptions: { ecmaVersion: 2022, sourceType: 'module', globals: { window: 'readonly', document: 'readonly', localStorage: 'readonly', fetch: 'readonly', URL: 'readonly', console: 'readonly', import: 'readonly' } },
  rules: { 'no-alert': 'off', 'no-console': 'off', 'no-undef': 'error' }
}];
