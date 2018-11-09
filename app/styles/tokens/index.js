const DesignSystem = require("design-system-utils").default

const pxFontSize = {
  base: 16,
}

const fontFamily = {
  inherit: 'inherit',
  base: '"Gotham-Regular","system"',
  semibold: '"Gotham-Medium", "system-medium"',
  bold: '"Gotham-Bold", "system-bold"',
  black: '"Gotham-Black", "system-bold"',
}

const colorPalette = {
  transparent: 'transparent',
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
    sizes: {
      xs: 12,
      sm: 14,
      md: 15,
      regular: 16,
      base: 18,
      md: 20,
      lg: 36,
      xl: 43
    },
    fontFamily,
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
  fontFamily,
}
