var fileListPlugin = require( './plugins/fileListPlugins.js')
var path = require('path')

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'demo-plugin.js'
  },
  plugins: [
    new fileListPlugin()
  ]
}