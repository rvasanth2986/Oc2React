const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use('/api',
    createProxyMiddleware({
      target: 'http://3.6.39.81',
      changeOrigin: true,
      logLevel: "debug"
    })
  )
};