import base from './rollup'
import path from 'path'
import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'

const resolveOutput = function (type) {
  const v = `/lib/web_rtc_sdk.${type}.js`
  return {
    file: resolveFile(v),
    format: type
  }
}

const resolveFile = function (filePath) {
  return path.join(__dirname, '..', filePath)
}

// 开启服务
const plugins = [
  serve({
    open: true, // 是否打开浏览器
    contentBase: './',
    historyApiFallback: true, // Set to true to return index.html instead of 404
    host: 'localhost',
    port: 3003
  }),
  livereload({
    verbose: true,
    watch: ['lib', 'packages', 'examples', 'config']
  })
]

export default {
  input: resolveFile('/examples/index.js'),
  plugins: [...base.plugins, ...plugins],
  output: [{
    ...resolveOutput('iife'),
    name: '$webRTC',
    external: base.external,
    globals: base.globals
  }]
}
