module.exports = {
  plugins: [
    require('tailwindcss')('./tailwind.js'),
    require('postcss-easy-import'),
    require('postcss-normalize'),
    require('postcss-preset-env')({
      stage: 0,
    }),
    require('postcss-extend'),
  ],
}
