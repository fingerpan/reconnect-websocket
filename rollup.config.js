

// const uglify = require("uglify-js");
const buble = require('rollup-plugin-buble')
const flow = require('rollup-plugin-flow-no-whitespace')
const typescript = require('rollup-plugin-typescript')
const cjs = require('rollup-plugin-commonjs')
const node = require('rollup-plugin-node-resolve')
const replace = require('rollup-plugin-replace')

// var
const version = process.env.VERSION || require('./package.json').version
const banner = `
/**
* vue-socket v${version}
* @author youngpan
* (c) ${new Date().getFullYear()}
*/`


export default {
  input: 'src/Socket.ts',
  plugins: [
    typescript({ lib: ["es5", "es6", "dom"], target: "es5" }),
    flow(),
    node(),
    cjs(),
    replace({
      __VERSION__: version
    }),
    buble()
  ],
  output: [
    {
        file: 'dist/reconnect-websocket.js',
        format: 'umd',
        env: 'development',
        banner,
        name: "ReconnectWebsocket"
      },
    //   {
    //     file: resolve('dist/reconnect-websocket.min.js'),
    //     format: 'umd',
    //     env: 'production'
    //   },
      {
        file: 'dist/reconnect-websocket.common.js',
        format: 'cjs',
        name: "ReconnectWebsocket",
        banner,
      },
      {
        file: 'dist/reconnect-websocket.esm.js',
        format: 'es'
      }
  ]
};
