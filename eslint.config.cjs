const parser = require('@typescript-eslint/parser');
const typescript = require('@typescript-eslint/eslint-plugin');
const prettier = require('eslint-plugin-prettier/recommended');

module.exports = [
  {
    files: ['src/**/*.ts'],
    languageOptions: {
      parser,
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { process: 'readonly', __dirname: 'readonly', console: 'readonly' }
    },
    plugins: { '@typescript-eslint': typescript },
    rules: {
      ...require('@eslint/js').configs.recommended.rules,
      'no-unused-vars': 'off',
      'no-cond-assign': ['error', 'except-parens'],
      'no-constant-condition': 'error',
      'no-unreachable': 'error',
      'no-undef': 'error',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-empty': ['error', { allowEmptyCatch: true }],
      'prefer-const': ['warn', { destructuring: 'all' }],
      'spaced-comment': 'warn'
    }
  },
  prettier
];
