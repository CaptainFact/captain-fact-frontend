"use strict"

const webpack = require('webpack')
const path = require('path')
const loadersConf = require('./webpack.loaders')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const WebpackCleanupPlugin = require('webpack-cleanup-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CompressionPlugin = require("compression-webpack-plugin")
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const CleanWebpackPlugin = require('clean-webpack-plugin')

module.exports = {
  mode: 'production',
  entry: {
    "app": [
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
      path.join(__dirname, "src"),
      path.join(__dirname, "node_modules"), // the old 'fallback' option (needed for npm link-ed packages)
    ],
    alias: {
      "styles": path.resolve(__dirname, 'styles/'),
    }
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: { test: /[\\/]node_modules[\\/]/, name: "vendor", chunks: "all" }
      }
    }
  },
  module: {
    rules: loadersConf
  },
  plugins: [
    // provides a nice visualisation on http://localhost:8888 for debugging bundle size (use with --watch)
    new BundleAnalyzerPlugin(),
    // cleans output folder
    new CleanWebpackPlugin(['public']),
    // minimizing is done by webpack as we are in prod mode
    new webpack.optimize.OccurrenceOrderPlugin(),
    // regroup styles in app.css bundle
    new ExtractTextPlugin({
      filename: 'app.[chunkhash].css',
      allChunks: true
    }),
    // gzip
    new CompressionPlugin({
      test: /\.(js|css)$/
    }),
    // load the bundles into an html template
    new HtmlWebpackPlugin({
      template: 'app/index.html',
      files: {
        css: ['app.css'],
        js: ["bundle.js"],
      }
    })
  ]
};