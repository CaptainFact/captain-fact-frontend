const colors = require('./colors').default
const fontFamilies = require('./fontFamilies').default
const fontSizes = require('./fontSizes').default
const fontWeights = require('./fontWeights').default
const DesignSystem = require("design-system-utils").default
const pxTo = require('design-system-utils').pxTo

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
      lg: 1199,
      xl: 1365,
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
    fontWeight: fontWeights,
  },
  colors: {
    ...colorPalette,
  },
  shadows: {
    slightDark: `0 ${pxTo(3, pxFontSize.base, "rem")} ${pxTo(36, pxFontSize.base, "rem")} rgba(140, 100, 255, 0.17)`,
    slightLight: `0 ${pxTo(5, pxFontSize.base, "rem")} ${pxTo(21, pxFontSize.base, "rem")} rgba(47, 47, 47, 0.19)`,
    mediumDark: `0 0 ${pxTo(4, pxFontSize.base, "rem")} rgba(0, 0, 0, 0.25);`,
    mediumLight: `0 0 ${pxTo(4, pxFontSize.base, "rem")} rgba(0, 0, 0, 0.25)`,
  },
  radius: {
    default: pxTo(3, pxFontSize.base, "rem"),
    md: pxTo(5, pxFontSize.base, "rem"),
    lg: pxTo(20, pxFontSize.base, "rem"),
    xl: pxTo(35, pxFontSize.base, "rem"),
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
  fontWeights,
}
