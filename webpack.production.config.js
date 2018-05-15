'use strict'

const webpack = require('webpack')
const path = require('path')
const loadersConf = require('./webpack.loaders')

// Plugins
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CompressionPlugin = require('compression-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const Dotenv = require('dotenv-webpack')

module.exports = {
  mode: 'production',
  entry: {
    'app': [
      // POLYFILL: Set up an ES6-ish environment
      // 'babel-polyfill',  // The entire babel-polyfill
      // Or pick es6 features needed (included into babel-polyfill)
      'core-js/fn/promise',
      'core-js/es6/object',
      'core-js/es6/array',
      // app entry point
      './app/router.jsx'
    ]
  },
  output: {
    publicPath: './',
    path: path.join(__dirname, 'public'),
    filename: '[name].[chunkhash].js'
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    modules: [
      path.join(__dirname, 'src'),
      path.join(__dirname, 'node_modules'), // the old 'fallback' option (needed for npm link-ed packages)
    ],
    alias: {
      'styles': path.resolve(__dirname, 'styles/'),
    }
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: { test: /[\\/]node_modules[\\/]/, name: 'vendor', chunks: 'all' }
      }
    },
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true
      }),
      new OptimizeCSSAssetsPlugin({})
    ]
  },
  module: {
    rules: loadersConf(true)
  },
  plugins: [
    // provides a nice visualisation on http://localhost:8888 for debugging bundle size
    // new BundleAnalyzerPlugin(),
    // cleans output folder
    new CleanWebpackPlugin(['public']),
    // minimizing is done by webpack as we are in prod mode
    new webpack.optimize.OccurrenceOrderPlugin(),
    // regroup styles in app.css bundle
    new MiniCssExtractPlugin({
      filename: 'app.[chunkhash].css',
      allChunks: true
    }),
    new CopyWebpackPlugin(
      [{ from: 'app/assets', to: '', toType: 'dir' }], // patterns
      {} // options
    ),
    // load the bundles into an html template
    new HtmlWebpackPlugin({
      template: 'app/index.html'
    }),
    // gzip
    new CompressionPlugin({
      test: /\.(js|css|html)$/
    }),
    // loads up .env file
    new Dotenv({
      path: 'config/env/prod.env',
      systemvars: true
    })
  ]
}
