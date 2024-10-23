import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import image from '@rollup/plugin-image';
import resolve from '@rollup/plugin-node-resolve';
import { readFileSync } from 'fs';
import external from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';
import { visualizer } from 'rollup-plugin-visualizer';

const pkg = JSON.parse(readFileSync('./package.json'));

const config = {
  input: './src/index.js',
  output: [
    { file: pkg.main, format: 'cjs' },
    { file: pkg.module, format: 'esm' },
  ],
  plugins: [
    external(),
    postcss(),
    babel({
      exclude: 'node_modules/**',
      babelHelpers: 'bundled',
      presets: ['@babel/preset-env', '@babel/preset-react'],
    }),
    resolve(),
    commonjs({ strictRequires: 'auto' }),
    image(),
    visualizer(),
  ],
};

export default config;
