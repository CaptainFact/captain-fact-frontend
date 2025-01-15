const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

// noinspection WebpackConfigHighlighting
module.exports = (isProd) => [
  // =========
  // = Babel =
  // =========
  {
    test: /\.(js|jsx|ts|tsx)$/,
    exclude: /node_modules/,
    loader: 'babel-loader',
    options: {
      // This is a feature of `babel-loader` for Webpack (not Babel itself).
      // It enables caching results in ./node_modules/.cache/babel-loader/
      // directory for faster rebuilds.
      cacheDirectory: true,
      presets: ['@babel/preset-env', '@babel/preset-react'],
    },
  },
  // =======================
  // = Fix for node stable =
  // = See https://github.com/graphql/graphql-js/issues/1272 =
  // =======================
  // {
  //   test: /\.mjs$/,
  //   include: /node_modules/,
  //   type: 'javascript/auto',
  // },
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
          name: 'res/[name].[contenthash].[ext]',
        },
      },
    ],
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
          name: 'res/[name].[contenthash].[ext]',
        },
      },
    ],
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
          name: 'res/[name].[contenthash].[ext]',
        },
      },
    ],
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
          name: 'res/[name].[contenthash].svg',
        },
      },
    ],
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
          name: 'res/[name].[contenthash].gif',
        },
      },
    ],
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
          name: 'res/[name].[contenthash].jpg',
        },
      },
    ],
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
          name: 'res/[name].[contenthash].png',
        },
      },
    ],
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
          name: 'res/[name].[contenthash].mp4',
        },
      },
    ],
  },
  {
    test: /\.(ogg|mp3)/,
    include: [path.resolve(__dirname, 'app/assets')],
    use: [{ loader: 'file-loader' }],
  },
  // ==========
  // = Styles =
  // ==========
  {
    test: /\.css$/,
    use: [
      {
        loader: !isProd ? 'style-loader' : MiniCssExtractPlugin.loader,
      },
      {
        loader: 'css-loader',
      },
      {
        loader: 'postcss-loader', // Processes Tailwind and other PostCSS plugins
        options: {
          postcssOptions: {
            plugins: [
              require('tailwindcss'), // Tailwind plugin
              require('autoprefixer'), // Autoprefixer for browser compatibility
            ],
          },
        },
      },
    ],
  },
]
