const path = require('path')

// Plugins
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const Dotenv = require('dotenv-webpack')
const loadersConf = require('./webpack.loaders')

const PORT = process.env.PORT || '3333'

module.exports = {
  mode: 'development',
  entry: {
    app: ['babel-polyfill', './app/index.jsx'],
  },
  // sourcemap complexity
  devtool: process.env.WEBPACK_DEVTOOL || 'inline-source-map',
  output: {
    publicPath: '/',
    path: path.join(__dirname, 'public'),
  },
  module: {
    rules: loadersConf(false),
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    modules: [path.join(__dirname, 'src'), 'node_modules'],
    alias: {
      styles: path.resolve(__dirname, 'styles/'),
    },
  },
  optimization: {
    splitChunks: { chunks: 'all' },
    runtimeChunk: 'single',
  },
  devServer: {
    static: './public',
    // serve index.html in place of 404 responses to allow HTML5 history
    historyApiFallback: true,
    open: false,
    port: PORT,
    hot: true,
  },
  plugins: [
    // regroup styles in app.css bundle
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
    // copy static assets as they are required from external sources
    new CopyWebpackPlugin({
      patterns: [{ from: 'app/static', to: '', toType: 'dir' }],
    }),
    // load the bundles into an html template
    new HtmlWebpackPlugin({
      template: 'app/index.html',
    }),
    // loads up .env file
    new Dotenv({
      path: './config/env/dev.env',
    }),
  ],
}
