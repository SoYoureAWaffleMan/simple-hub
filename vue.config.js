module.exports = {
  publicPath: '/sov-hub/',
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
