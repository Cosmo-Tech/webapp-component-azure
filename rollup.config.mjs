import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import { readFileSync } from 'fs';
import external from 'rollup-plugin-peer-deps-external';

const pkg = JSON.parse(readFileSync('./package.json'));

const config = {
  input: './src/index.js',
  output: [
    { file: pkg.main, format: 'cjs' },
    { file: pkg.module, format: 'esm' },
  ],
  plugins: [
    external(),
    babel({
      exclude: 'node_modules/**',
      babelHelpers: 'bundled',
      presets: ['@babel/preset-env', '@babel/preset-react'],
    }),
    resolve(),
    commonjs({ strictRequires: 'auto' }),
  ],
};

export default config;
