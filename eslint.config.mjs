import js from '@eslint/js';
import jest from 'eslint-plugin-jest';
import { defineConfig } from 'eslint/config';
import globals from 'globals';

export default defineConfig([
  {
    files: ['**/*.{js,cjs}'],
    plugins: { js },
    extends: ['js/recommended'],
    languageOptions: { sourceType: 'commonjs', globals: globals.node },
  },
  {
    files: ['**/*.mjs'],
    plugins: { js },
    extends: ['js/recommended'],
    languageOptions: { sourceType: 'module', globals: globals.node },
  },
  {
    files: ['**/*.{test,spec}.{js,mjs,cjs}'],
    plugins: { jest },
    languageOptions: {
      globals: globals.jest,
    },
    rules: {
      ...jest.configs.recommended.rules,
    },
  },
]);
