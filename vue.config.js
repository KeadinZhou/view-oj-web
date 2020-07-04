let buildTime = new Date()
module.exports = {
  publicPath: './',
  productionSourceMap: false,
  chainWebpack: config => {
    config
      .plugin('html')
      .tap(args => {
        args[0].buildTime= buildTime
        return args
      })
  }
}
