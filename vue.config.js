module.exports = {
  // For deploy build...
  // publicPath: '/sov-hub/',
  publicPath: '',
  configureWebpack: {
    optimization: {
      splitChunks: false
    }
  },
  filenameHashing: false,
  pages: {
    sovApp: {
      entry: 'src/main.js',
      filename: 'index.html',
      minify : false
    }
  }
}
