class FileListPlugin {
  apply(compiler) {
    console.log('plugins...')
    // emit is asynchronous hook, tapping into it using tapAsync, you cna use tapPromise/tap(synchronous) as well
    compiler.hooks.emit.tapAsync('FileListPlugin', (compilation, callback) => {
      var fileList = 'In this build:\n\n'
      
      // loop through all compiled asssets
      // adding a new line item for each filename.
      for (var filename in compilation.assets) {
        fileList += '- ' + filename + '\n'
      }

      // Insert this list into the webpack build as a new file asset
      compilation.assets['fileList.md'] = {
        source: function() 
        { 
          console.log('source:', fileList)
          return fileList
        },
        size: function() {
          console.log('size:', fileList.length)
          return fileList.length
        }
      }
      callback()
    })
  }
}

module.exports = FileListPlugin