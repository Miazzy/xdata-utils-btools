import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import { uglify } from 'rollup-plugin-uglify'

export default {
  input: './index.js',
  output: [
    {
      file: 'dist/bes-utils.min.js',
      format: 'umd',
      name: 'BesUtils'
    }
  ],
  watch: {
    exclude: 'node_modules/**'
  },
  plugins: [
    resolve(),
    commonjs(),
    uglify()
  ]
}
