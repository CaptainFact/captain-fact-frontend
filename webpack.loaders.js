const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

// Options passed to node-sass
const sassIncludePaths = [
  path.resolve(__dirname, 'styles'),
];


// These files will be imported in every sass file
// TODO use this feature and refactor existing ? 
const sassResourcesPaths = [
  // path.resolve(__dirname, 'styles/abstracts/_variables.sass'),
  // path.resolve(__dirname, 'styles/abstracts/_mixins.sass'),
];

// noinspection WebpackConfigHighlighting
module.exports = [
  // =========
  // = Babel =
  // =========
  // Load jsx extensions with babel so we can use
  // 'import' instead of 'require' and es6 syntax
  {
    test: /\.jsx?$/,
    include: path.resolve(__dirname, 'app'),
    loader: "babel-loader",
    options: {
      // This is a feature of `babel-loader` for Webpack (not Babel itself).
      // It enables caching results in ./node_modules/.cache/babel-loader/
      // directory for faster rebuilds.
      cacheDirectory: true,
      presets: [
        ['es2015', { loose: true, modules: "umd" }],
        'react'
      ],
      plugins: [
        'transform-class-properties',
        'transform-decorators-legacy',
        'transform-runtime'
      ]
      // plugins: ['transform-decorators-legacy', '],
    }
  },
  // =========
  // = Fonts =
  // =========
  {
    test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
    exclude: path.resolve(__dirname, "node_modules"),
    use: ["file-loader"]
  },
  {
    test: /\.(woff|woff2)$/,
    exclude: path.resolve(__dirname, "node_modules"),
    use: [
      {
        loader: "url-loader",
        options: { prefix: "font", limit: 5000 }
      }
    ]
  },
  {
    test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
    exclude: path.resolve(__dirname, "node_modules"),
    use: [
      {
        loader: "url-loader",
        options: {
          prefix: "font",
          limit: 10000,
          mimetype: "application/octet-stream"
        }
      }
    ]
  },
  // ==========
  // = Images =
  // ==========
  {
    test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
    exclude: path.resolve(__dirname, "node_modules"),
    use: [
      {
        loader: "url-loader",
        options: {
          limit: 10000,
          mimetype: "image/svg+xml"
        }
      }
    ]
  },
  {
    test: /\.gif/,
    include: [
      path.resolve(__dirname, 'app/assets')
    ],
    exclude: path.resolve(__dirname, "node_modules"),
    use: [
      {
        loader: "file-loader",
        options: {
          limit: 10000,
          mimetype: "image/gif"
        }
      }
    ]
  },
  {
    test: /\.jpg/,
    include: [
      path.resolve(__dirname, 'app/assets')
    ],
    exclude: path.resolve(__dirname, "node_modules"),
    use: [
      {
        loader: "file-loader",
        options: {
          limit: 10000,
          mimetype: "image/jpg"
        }
      }
    ]
  },
  {
    test: /\.png/,
    include: [
      path.resolve(__dirname, 'app/assets')
    ],
    exclude: path.resolve(__dirname, "node_modules"),
    use: [
      {
        loader: "file-loader",
        options: {
          limit: 10000,
          mimetype: "image/png",
          name: "[path][name].[ext]"
        }
      }
    ]
  },
  // ==========
  // = Styles =
  // ==========
  // Global CSS (from node_modules)
  // ==============================
  {
    test: /\.css/,
    include: path.resolve(__dirname, "node_modules"),
    use: [
      {
        loader: "style-loader"
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
    loader: ExtractTextPlugin.extract([
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
    ])
  }
];