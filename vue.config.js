module.exports = {
  // For deploy build...
  // publicPath: '/sov-hub/',

  // For build w/ relative paths
  // publicPath: '/wp-content/plugins/sov-plugin/',

  // For build w/ github paths
  publicPath: 'https://soyoureawaffleman.github.io/sov-hub/',

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
