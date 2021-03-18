

const webpack = require('webpack')
const path = require('path')

// Plugins
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const Dotenv = require('dotenv-webpack')
const loadersConf = require('./webpack.loaders')

const HOST = process.env.HOST || 'localhost'
const PORT = process.env.PORT || '3333'


module.exports = {
  mode: 'development',
  entry: {
    app: [
      'babel-polyfill',
      'react-hot-loader/patch',
      './app/index.jsx'
    ]
  },
  // sourcemap complexity
  devtool: process.env.WEBPACK_DEVTOOL || 'eval',
  output: {
    publicPath: '/',
    path: path.join(__dirname, 'public')
  },
  module: {
    rules: loadersConf(false)
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    modules: [
      path.join(__dirname, 'src'),
      path.join(__dirname, 'node_modules'), // the old 'fallback' option (needed for npm link-ed packages)
    ],
    alias: {
      styles: path.resolve(__dirname, 'styles/'),
      'react-dom': '@hot-loader/react-dom',
    }
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: { test: /[\\/]node_modules[\\/]/, name: 'vendor', chunks: 'all' }
      }
    }
  },
  devServer: {
    contentBase: './public',
    // do not print bundle build stats
    noInfo: false,
    // enable HMR
    hot: true,
    // embed the webpack-dev-server runtime into the bundle
    inline: true,
    // serve index.html in place of 404 responses to allow HTML5 history
    historyApiFallback: true,
    open: false,
    port: PORT,
    host: HOST
  },
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.ProvidePlugin({
      fetch: 'exports-loader?self.fetch!whatwg-fetch/dist/fetch.umd'
    }),
    // regroup styles in app.css bundle
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
    // copy static assets as they are required from external sources
    new CopyWebpackPlugin(
      [{ from: 'app/static', to: '', toType: 'dir' }], // patterns
      {} // options
    ),
    // load the bundles into an html template
    new HtmlWebpackPlugin({
      template: 'app/index.html'
    }),
    // loads up .env file
    new Dotenv({
      path: './config/env/dev.env'
    })
  ]
}
