const withPlugins = require('next-compose-plugins')
const images = require('next-images')
const sass = require('@zeit/next-sass')

module.exports = withPlugins([[sass], [images]], {
  webpack(config) {
    return {
      ...config,
      module: {
        ...(config.module || {}),
        rules: [
          ...(config.module || {}).rules,
          {
            test: /\.(mp3)$/,
            loader: 'file-loader',
            options: {
              name: '[name]_[hash].[ext]',
              publicPath: `/_next/static/files`,
              outputPath: 'static/files'
            }
          }
        ]
      }
    }
  }
})
