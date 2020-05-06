module.exports = {
  // For deploy build...
  // publicPath: '/sov-hub/',

  // For build w/ relative paths
  // publicPath: '/wp-content/plugins/sov-plugin/',

  // For build w/ github paths - get all assets from here
  // publicPath: 'https://soyoureawaffleman.github.io/sov-hub/',

  // For conditional build w/ github paths. Note this messes w/ router-generated URLs
  publicPath: process.env.NODE_ENV === 'production'
    ? 'https://soyoureawaffleman.github.io/sov-hub/'
    : '/',

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
