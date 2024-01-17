const path = require('path')

// Plugins
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CompressionPlugin = require('compression-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const Dotenv = require('dotenv-webpack')
const loadersConf = require('./webpack.loaders')

module.exports = {
  mode: 'production',
  entry: {
    app: ['babel-polyfill', './app/index.jsx'],
  },
  output: {
    publicPath: '/',
    path: path.join(__dirname, 'public'),
    filename: '[name].[chunkhash].js',
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    modules: [
      path.join(__dirname, 'src'),
      path.join(__dirname, 'node_modules'), // the old 'fallback' option (needed for npm link-ed packages)
    ],
    alias: {
      styles: path.resolve(__dirname, 'styles/'),
    },
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
    minimizer: [
      new TerserPlugin({
        cache: true,
        parallel: true,
        sourceMap: true,
      }),
      new CssMinimizerPlugin(),
    ],
  },
  module: {
    rules: loadersConf(true),
  },
  plugins: [
    // provides a nice visualisation on http://localhost:8888 for debugging bundle size
    // new BundleAnalyzerPlugin(),
    // cleans output folder
    new CleanWebpackPlugin({ cleanOnceBeforeBuildPatterns: ['public'] }),
    // regroup styles in app.css bundle
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
      chunkFilename: '[id].[contenthash].css',
    }),
    // copy static assets as they are required from external sources
    new CopyWebpackPlugin({
      patterns: [{ from: 'app/static', to: '', toType: 'dir' }],
    }),
    // load the bundles into an html template
    new HtmlWebpackPlugin({
      template: 'app/index.html',
      minify: true,
    }),
    // gzip
    new CompressionPlugin({
      test: /\.(js|css|html)$/,
    }),
    // loads up .env file
    new Dotenv({
      path: 'config/env/prod.env',
      systemvars: true,
    }),
  ],
}
