const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

// noinspection WebpackConfigHighlighting
module.exports = isProd => [
  // =========
  // = Babel =
  // =========
  // Load jsx extensions with babel so we can use
  // 'import' instead of 'require' and es6 syntax
  {
    test: /\.jsx?$/,
    include: [path.resolve(__dirname, 'app'), path.resolve(__dirname, 'styleguide')],
    loader: 'babel-loader',
    options: {
      // This is a feature of `babel-loader` for Webpack (not Babel itself).
      // It enables caching results in ./node_modules/.cache/babel-loader/
      // directory for faster rebuilds.
      cacheDirectory: true
    }
  },
  // =======================
  // = Fix for node stable =
  // = See https://github.com/graphql/graphql-js/issues/1272 =
  // =======================
  {
    test: /\.mjs$/,
    include: /node_modules/,
    type: 'javascript/auto'
  },
  // =========
  // = Fonts =
  // =========
  {
    test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
    exclude: path.resolve(__dirname, 'node_modules'),
    use: [
      {
        loader: 'file-loader',
        options: {
          name: 'res/[name].[hash].[ext]'
        }
      }
    ]
  },
  {
    test: /\.(woff|woff2)$/,
    exclude: path.resolve(__dirname, 'node_modules'),
    use: [
      {
        loader: 'url-loader',
        options: {
          prefix: 'font',
          limit: 5000,
          name: 'res/[name].[hash].[ext]'
        }
      }
    ]
  },
  {
    test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
    exclude: path.resolve(__dirname, 'node_modules'),
    use: [
      {
        loader: 'url-loader',
        options: {
          prefix: 'font',
          limit: 10000,
          mimetype: 'application/octet-stream',
          name: 'res/[name].[hash].[ext]'
        }
      }
    ]
  },
  // ==========
  // = Images =
  // ==========
  {
    test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
    exclude: path.resolve(__dirname, 'node_modules'),
    use: [
      {
        loader: 'url-loader',
        options: {
          limit: 10000,
          mimetype: 'image/svg+xml',
          name: 'res/[name].[hash].svg'
        }
      }
    ]
  },
  {
    test: /\.gif/,
    include: [path.resolve(__dirname, 'app/assets')],
    exclude: path.resolve(__dirname, 'node_modules'),
    use: [
      {
        loader: 'file-loader',
        options: {
          limit: 10000,
          mimetype: 'image/gif',
          name: 'res/[name].[hash].gif'
        }
      }
    ]
  },
  {
    test: /\.jpg/,
    include: [path.resolve(__dirname, 'app/assets')],
    exclude: path.resolve(__dirname, 'node_modules'),
    use: [
      {
        loader: 'file-loader',
        options: {
          limit: 10000,
          mimetype: 'image/jpg',
          name: 'res/[name].[hash].jpg'
        }
      }
    ]
  },
  {
    test: /\.png/,
    include: [path.resolve(__dirname, 'app/assets')],
    exclude: path.resolve(__dirname, 'node_modules'),
    use: [
      {
        loader: 'file-loader',
        options: {
          limit: 10000,
          mimetype: 'image/png',
          name: 'res/[name].[hash].png'
        }
      }
    ]
  },
  {
    test: /\.mp4/,
    include: [path.resolve(__dirname, 'app/assets')],
    exclude: path.resolve(__dirname, 'node_modules'),
    use: [
      {
        loader: 'file-loader',
        options: {
          limit: 10000,
          mimetype: 'video/mp4',
          name: 'res/[name].[hash].mp4'
        }
      }
    ]
  },
  {
    test: /\.(ogg|mp3)/,
    include: [path.resolve(__dirname, 'app/assets')],
    use: [{ loader: 'file-loader' }]
  },
  // ==========
  // = Styles =
  // ==========
  // Global CSS (from node_modules)
  // ==============================
  {
    test: /\.css/,
    include: path.resolve(__dirname, 'node_modules'),
    use: [
      {
        loader: !isProd ? 'style-loader' : MiniCssExtractPlugin.loader
      },
      {
        loader: 'css-loader'
      }
    ]
  },
  {
    test: /\.(sass|scss)$/,
    include: [
      path.resolve(__dirname, 'node_modules'),
      path.resolve(__dirname, 'app/styles')
    ],
    use: [
      {
        loader: !isProd ? 'style-loader' : MiniCssExtractPlugin.loader
      },
      {
        loader: 'css-loader'
      },
      {
        loader: 'sass-loader',
        options: {
          includePaths: [
            path.resolve(__dirname, 'node_modules'),
            path.resolve(__dirname, 'app/styles'),
            path.resolve(__dirname, 'node_modules/animate.scss/vendor/assets/stylesheets')
          ]
        }
      }
    ]
  }
]
