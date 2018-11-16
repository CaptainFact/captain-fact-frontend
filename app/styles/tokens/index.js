const colors = require('./colors').default
const fontFamilies = require('./fontFamilies').default
const fontSizes = require('./fontSizes').default
const DesignSystem = require("design-system-utils").default

const pxFontSize = {
  base: fontSizes.base,
}

const colorPalette = {
  transparent: 'transparent',
  ...colors,
}

const myDesignSystem = {
  grid: {
    columns: {
      number: 12,
      width: 60,
      gutter: 20,
    },
    width: {
      xs: "100%",
      sm: 750,
      md: 940,
    },
  },
  breakpoints: {
      xs: 320,
      sm: 767,
      md: 991,
      lg: 1199,
      xl: 1365,
  },
  type: {
    sizes: fontSizes,
    fontFamily: fontFamilies,
  },
  colors: {
    ...colorPalette,
  },
}

const ds = new DesignSystem(myDesignSystem, {
  useModularScale: true,
  fontSizeUnit: "rem",
})

module.exports = {
  ds,
  colorPalette,
  fontFamilies,
}
