module.exports = {
  files: {
    javascripts: {joinTo: {
      'assets/js/vendor.js': /^(?!app)/,
      'assets/js/app.js': /^app/
    }},
    stylesheets: {joinTo: 'assets/css/app.css'}
  },

  modules: {
    autoRequire: {
      'assets/js/app.js': ['router']
    }
  },

  plugins: {
    babel: {
      presets: ['es2015', 'react'],
      plugins: ["transform-decorators-legacy", "transform-class-properties"]
    },
    sass: {
      mode: 'native',
      options: {
        includePaths: [
          "node_modules",
          "node_modules/animate.scss/vendor/assets/stylesheets"
        ]
      }
    },
    copycat: {
      "assets/fonts": [
        "node_modules/font-awesome/fonts"
      ]
    },
    gzip: {
      paths: {
        javascript: 'assets/js',
        stylesheet: 'assets/css'
      }
    }
  }
}
