import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import prettier from 'eslint-plugin-prettier';
import globals from 'globals';
import neostandard from 'neostandard';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});
const neostandardConfig = neostandard({ semi: true, noStyle: true });

export default [
  {
    ignores: ['**/build', '**/dist', '**/.docz', '**/.github', '**/node_modules'],
  },
  ...neostandardConfig,
  ...compat.extends('prettier', 'plugin:prettier/recommended'),
  {
    plugins: {
      prettier,
    },

    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },

      ecmaVersion: 12,
      sourceType: 'module',
    },

    rules: {
      'no-constant-binary-expression': 'error',
      semi: [2, 'always'],

      'max-len': [
        'error',
        {
          code: 120,
        },
      ],
    },
  },
];
