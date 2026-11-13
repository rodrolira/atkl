// Flat config (ESLint 9). El archivo anterior usaba el formato antiguo
// (`overrides`), que en flat config se ignora en silencio: ninguna regla
// corría, por eso pasó inadvertido un hook condicional que rompía la página.
const globals = require('globals');
const reactHooks = require('eslint-plugin-react-hooks');
const tsParser = require('@typescript-eslint/parser');

module.exports = [
  {
    ignores: ['node_modules/**', 'dist/**', 'build/**', 'coverage/**', 'public/**'],
  },
  {
    files: ['src/**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: { ...globals.browser, ...globals.es2021 },
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      // Registrados (sin activar reglas) para que los `eslint-disable` que ya
      // existen en el código no fallen con "rule not found".
      react: require('eslint-plugin-react'),
      import: require('eslint-plugin-import'),
    },
    rules: {
      // Esta es la regla que importa: un hook después de un `return` temprano
      // rompe el render en producción.
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'no-undef': 'off', // TypeScript ya cubre esto
    },
  },
];
