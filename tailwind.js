const  pxTo = require('design-system-utils').pxTo
const ds = require('./app/styles/tokens/index.js').ds
const colors = require('./app/styles/tokens/index.js').colorPalette
const fontFamilies = require('./app/styles/tokens/index.js').fontFamilies
const fontWeights = require('./app/styles/tokens/index.js').fontWeights

const baseFontSize = ds.get('type.baseFontSize')
const columns = ds.get('grid.columns.number')
const widths = {}
for (let index = 1; index < columns + 1; index++) {
  widths[`${index}/${columns}`] = `${index / columns * 100}%`
}


/*

Tailwind - The Utility-First CSS Framework
View the full documentation at https://tailwindcss.com.

*/

/*
|-------------------------------------------------------------------------------
| Colors                                    https://tailwindcss.com/docs/colors
|-------------------------------------------------------------------------------
*/


module.exports = {

  /*
  |-----------------------------------------------------------------------------
  | Colors                                  https://tailwindcss.com/docs/colors
  |-----------------------------------------------------------------------------
  */

  colors,

  /*
  |-----------------------------------------------------------------------------
  | Screens                      https://tailwindcss.com/docs/responsive-design
  |-----------------------------------------------------------------------------
  | Class name: .{screen}:{utility}
  */

  screens: {
    sm: pxTo(ds.get('breakpoints.sm'), baseFontSize, 'rem'),
    md: pxTo(ds.get('breakpoints.md'), baseFontSize, 'rem'),
  },

  /*
  |-----------------------------------------------------------------------------
  | Fonts                                    https://tailwindcss.com/docs/fonts
  |-----------------------------------------------------------------------------
  | Class name: .font-{name}
  */

  fonts: {
    unset: ['unset'],
    inherit: ['inherit'],
    base: fontFamilies.base.split(),
    secondary: fontFamilies.secondary.split(),
  },

  /*
  |-----------------------------------------------------------------------------
  | Text sizes                         https://tailwindcss.com/docs/text-sizing
  |-----------------------------------------------------------------------------
  | Class name: .text-{size}
  */

  textSizes: {
    unset: 'unset',
    inherit: 'inherit',
    px: `${ds.get('type.sizes.base')}px`, // 18px
    xs: pxTo(ds.get('type.sizes.xs'), baseFontSize, 'rem'),
    sm: pxTo(ds.get('type.sizes.sm'), baseFontSize, 'rem'),
    regular: pxTo(ds.get('type.sizes.regular'), baseFontSize, 'rem'),
    base: pxTo(ds.get('type.sizes.base'), baseFontSize, 'rem'),
    md: pxTo(ds.get('type.sizes.md'), baseFontSize, 'rem'),
    lg: pxTo(ds.get('type.sizes.lg'), baseFontSize, 'rem'),
  },

  /*
  |-----------------------------------------------------------------------------
  | Font weights                       https://tailwindcss.com/docs/font-weight
  |-----------------------------------------------------------------------------
  | Class name: .font-{weight}
  */

  fontWeights: {
    unset: 'unset',
    inherit: 'inherit',
    ...fontWeights,
  },

  /*
  |-----------------------------------------------------------------------------
  | Leading (line height)              https://tailwindcss.com/docs/line-height
  |-----------------------------------------------------------------------------
  | Class name: .leading-{size}
  */

  leading: {
    unset: 'unset',
    inherit: 'inherit',
    initial: 'initial',
    none: 1,
    tight: 1.25,
    normal: 1.5,
    loose: 2,
  },

  /*
  |-----------------------------------------------------------------------------
  | Tracking (letter spacing)       https://tailwindcss.com/docs/letter-spacing
  |-----------------------------------------------------------------------------
  | Class name: .tracking-{size}
  */

  tracking: {
    0: 0,
    1: pxTo(1, baseFontSize, 'rem'),
    2: pxTo(2, baseFontSize, 'rem'),
    3: pxTo(3, baseFontSize, 'rem'),
    4: pxTo(4, baseFontSize, 'rem'),
    5: pxTo(5, baseFontSize, 'rem'),
  },

  /*
  |-----------------------------------------------------------------------------
  | Text colors                         https://tailwindcss.com/docs/text-color
  |-----------------------------------------------------------------------------
  | Class name: .text-{color}
  */

  textColors: colors,

  /*
  |-----------------------------------------------------------------------------
  | Background colors             https://tailwindcss.com/docs/background-color
  |-----------------------------------------------------------------------------
  | Class name: .bg-{color}
  */

  backgroundColors: colors,

  /*
  |-----------------------------------------------------------------------------
  | Background sizes               https://tailwindcss.com/docs/background-size
  |-----------------------------------------------------------------------------
  | Class name: .bg-{size}
  */

  backgroundSize: {
    unset: 'unset',
    inherit: 'inherit',
    initial: 'initial',
    auto: 'auto',
    cover: 'cover',
    contain: 'contain',
  },

  /*
  |-----------------------------------------------------------------------------
  | Border widths                     https://tailwindcss.com/docs/border-width
  |-----------------------------------------------------------------------------
  | Class name: .border{-side?}{-width?}
  */

  borderWidths: {
    unset: 'unset',
    inherit: 'inherit',
    initial: 'initial',
    1: pxTo(1, baseFontSize, 'rem'),
    0: '0',
    2: pxTo(2, baseFontSize, 'rem'),
  },

  /*
  |-----------------------------------------------------------------------------
  | Border colors                     https://tailwindcss.com/docs/border-color
  |-----------------------------------------------------------------------------
  | Class name: .border-{color}
  */

  borderColors: global.Object.assign({ default: colors['grey-light'] }, colors),

  /*
  |-----------------------------------------------------------------------------
  | Border radius                    https://tailwindcss.com/docs/border-radius
  |-----------------------------------------------------------------------------
  | Class name: .rounded{-side?}{-size?}
  */

  borderRadius: {
    unset: 'unset',
    inherit: 'inherit',
    initial: 'initial',
    none: '0',
    full: '9999px',
    ...ds.get('radius'),
  },

  /*
  |-----------------------------------------------------------------------------
  | Width                                    https://tailwindcss.com/docs/width
  |-----------------------------------------------------------------------------
  | Class name: .w-{size}
  */

  width: {
    unset: 'unset',
    inherit: 'inherit',
    initial: 'initial',
    auto: 'auto',
    0: '0',
    15: pxTo(15, baseFontSize, 'rem'),
    20: pxTo(20, baseFontSize, 'rem'),
    25: pxTo(25, baseFontSize, 'rem'),
    30: pxTo(30, baseFontSize, 'rem'),
    35: pxTo(35, baseFontSize, 'rem'),
    50: pxTo(50, baseFontSize, 'rem'),
    75: pxTo(75, baseFontSize, 'rem'),
    screen: '100vw',
    full: '100%',
    ...widths,
  },

  /*
  |-----------------------------------------------------------------------------
  | Height                                  https://tailwindcss.com/docs/height
  |-----------------------------------------------------------------------------
  | Class name: .h-{size}
  */

  height: {
    unset: 'unset',
    inherit: 'inherit',
    initial: 'initial',
    auto: 'auto',
    0: '0',
    15: pxTo(15, baseFontSize, 'rem'),
    20: pxTo(20, baseFontSize, 'rem'),
    25: pxTo(25, baseFontSize, 'rem'),
    30: pxTo(30, baseFontSize, 'rem'),
    35: pxTo(35, baseFontSize, 'rem'),
    50: pxTo(50, baseFontSize, 'rem'),
    75: pxTo(75, baseFontSize, 'rem'),
    full: '100%',
    screen: '100vh'
  },

  /*
  |-----------------------------------------------------------------------------
  | Minimum width                        https://tailwindcss.com/docs/min-width
  |-----------------------------------------------------------------------------
  | Class name: .min-w-{size}
  */

  minWidth: {
    unset: 'unset',
    inherit: 'inherit',
    initial: 'initial',
    0: '0',
    full: '100%',
    ...widths,
  },

  /*
  |-----------------------------------------------------------------------------
  | Minimum height                      https://tailwindcss.com/docs/min-height
  |-----------------------------------------------------------------------------
  | Class name: .min-h-{size}
  */

  minHeight: {
    unset: 'unset',
    inherit: 'inherit',
    initial: 'initial',
    0: '0',
    full: '100%',
    screen: '100vh'
  },

  /*
  |-----------------------------------------------------------------------------
  | Maximum width                        https://tailwindcss.com/docs/max-width
  |-----------------------------------------------------------------------------
  | Class name: .max-w-{size}
  */

  maxWidth: {
    unset: 'unset',
    inherit: 'inherit',
    initial: 'initial',
    0: '0',
    full: '100%',
    ...widths,
  },

  /*
  |-----------------------------------------------------------------------------
  | Maximum height                      https://tailwindcss.com/docs/max-height
  |-----------------------------------------------------------------------------
  | Class name: .max-h-{size}
  */

  maxHeight: {
    unset: 'unset',
    inherit: 'inherit',
    initial: 'initial',
    0: '0',
    full: '100%',
    screen: '100vh',
  },

  /*
  |-----------------------------------------------------------------------------
  | Padding                                https://tailwindcss.com/docs/padding
  |-----------------------------------------------------------------------------
  | Class name: .p{side?}-{size}
  */

  padding: {
    unset: 'unset',
    px: '1px',
    0: '0',
    2: pxTo(2, baseFontSize, 'rem'),
    5: pxTo(5, baseFontSize, 'rem'),
    10: pxTo(10, baseFontSize, 'rem'),
    15: pxTo(15, baseFontSize, 'rem'),
    20: pxTo(20, baseFontSize, 'rem'),
    25: pxTo(25, baseFontSize, 'rem'),
    30: pxTo(30, baseFontSize, 'rem'),
    40: pxTo(40, baseFontSize, 'rem'),
    50: pxTo(50, baseFontSize, 'rem'),
    60: pxTo(60, baseFontSize, 'rem'),
    100: pxTo(100, baseFontSize, 'rem'),
  },

  /*
  |-----------------------------------------------------------------------------
  | Margin                                  https://tailwindcss.com/docs/margin
  |-----------------------------------------------------------------------------
  | Class name: .m{side?}-{size}
  */

  margin: {
    unset: 'unset',
    auto: 'auto',
    px: '1px',
    0: '0',
    2: pxTo(2, baseFontSize, 'rem'),
    5: pxTo(5, baseFontSize, 'rem'),
    10: pxTo(10, baseFontSize, 'rem'),
    15: pxTo(15, baseFontSize, 'rem'),
    20: pxTo(20, baseFontSize, 'rem'),
    25: pxTo(25, baseFontSize, 'rem'),
    30: pxTo(30, baseFontSize, 'rem'),
    40: pxTo(40, baseFontSize, 'rem'),
    50: pxTo(50, baseFontSize, 'rem'),
    60: pxTo(60, baseFontSize, 'rem'),
    100: pxTo(100, baseFontSize, 'rem'),
  },

  /*
  |-----------------------------------------------------------------------------
  | Negative margin                https://tailwindcss.com/docs/negative-margin
  |-----------------------------------------------------------------------------
  | Class name: .-m{side?}-{size}
  */

  negativeMargin: {
    unset: 'unset',
    px: '1px',
    0: '0',
    2: pxTo(2, baseFontSize, 'rem'),
    5: pxTo(5, baseFontSize, 'rem'),
    10: pxTo(10, baseFontSize, 'rem'),
    15: pxTo(15, baseFontSize, 'rem'),
    20: pxTo(20, baseFontSize, 'rem'),
    25: pxTo(25, baseFontSize, 'rem'),
    30: pxTo(30, baseFontSize, 'rem'),
    40: pxTo(40, baseFontSize, 'rem'),
    50: pxTo(50, baseFontSize, 'rem'),
    60: pxTo(60, baseFontSize, 'rem'),
    100: pxTo(100, baseFontSize, 'rem'),
  },

  /*
  |-----------------------------------------------------------------------------
  | Shadows                                https://tailwindcss.com/docs/shadows
  |-----------------------------------------------------------------------------
  | Class name: .shadow-{size?}
  */

  shadows: {
    unset: 'unset',
    inherit: 'inherit',
    ...ds.get('shadows'),
  },

  /*
  |-----------------------------------------------------------------------------
  | Z-index                                https://tailwindcss.com/docs/z-index
  |-----------------------------------------------------------------------------
  | Class name: .z-{index}
  */

  zIndex: {
    unset: 'unset',
    inherit: 'inherit',
    auto: 'auto',
    n: '-1',
    0: 0,
    10: 10,
    20: 20,
    30: 30,
    40: 40,
    50: 50,
  },

  /*
  |-----------------------------------------------------------------------------
  | Opacity                                https://tailwindcss.com/docs/opacity
  |-----------------------------------------------------------------------------
  | Class name: .opacity-{name}
  */

  opacity: {
    unset: 'unset',
    inherit: 'inherit',
    0: '0',
    25: '.25',
    45: '.45',
    50: '.5',
    75: '.75',
    100: '1',
  },

  /*
  |-----------------------------------------------------------------------------
  | SVG fill                                   https://tailwindcss.com/docs/svg
  |-----------------------------------------------------------------------------
  | Class name: .fill-{name}
  */

  svgFill: {
    unset: 'unset',
    inherit: 'inherit',
    current: 'currentColor',
  },

  /*
  |-----------------------------------------------------------------------------
  | SVG stroke                                 https://tailwindcss.com/docs/svg
  |-----------------------------------------------------------------------------
  | Class name: .stroke-{name}
  */

  svgStroke: {
    unset: 'unset',
    inherit: 'inherit',
    current: 'currentColor',
  },

  /*
  |-----------------------------------------------------------------------------
  | Modules                  https://tailwindcss.com/docs/configuration#modules
  |-----------------------------------------------------------------------------
  |
  | Here is where you control which modules are generated and what variants are
  | generated for each of those modules.
  |
  | Currently supported variants:
  |   - responsive
  |   - hover
  |   - focus
  |   - active
  |   - group-hover
  |
  | To disable a module completely, use `false` instead of an array.
  |
  */

  modules: {
    appearance: ['responsive'],
    backgroundAttachment: ['responsive'],
    backgroundColors: ['responsive', 'hover', 'focus', 'focus-within'],
    backgroundPosition: ['responsive'],
    backgroundRepeat: ['responsive'],
    backgroundSize: ['responsive'],
    borderCollapse: [],
    borderColors: ['responsive', 'hover', 'focus'],
    borderRadius: ['responsive'],
    borderStyle: ['responsive'],
    borderWidths: ['responsive'],
    cursor: ['responsive'],
    display: ['responsive'],
    flexbox: ['responsive'],
    float: ['responsive'],
    fonts: ['responsive'],
    fontWeights: ['responsive', 'hover', 'focus'],
    height: ['responsive'],
    leading: ['responsive'],
    lists: ['responsive'],
    margin: ['responsive'],
    maxHeight: ['responsive'],
    maxWidth: ['responsive'],
    minHeight: ['responsive'],
    minWidth: ['responsive'],
    negativeMargin: ['responsive'],
    opacity: ['responsive'],
    outline: ['focus'],
    overflow: ['responsive'],
    padding: ['responsive'],
    pointerEvents: ['responsive'],
    position: ['responsive'],
    resize: ['responsive'],
    shadows: ['responsive', 'hover', 'focus'],
    svgFill: [],
    svgStroke: [],
    tableLayout: ['responsive'],
    textAlign: ['responsive'],
    textColors: ['responsive', 'hover', 'focus'],
    textSizes: ['responsive'],
    textStyle: ['responsive', 'hover', 'focus'],
    tracking: ['responsive'],
    userSelect: ['responsive'],
    verticalAlign: ['responsive'],
    visibility: ['responsive'],
    whitespace: ['responsive'],
    width: ['responsive'],
    zIndex: ['responsive'],
  },

  /*
  |-----------------------------------------------------------------------------
  | Plugins                                https://tailwindcss.com/docs/plugins
  |-----------------------------------------------------------------------------
  |
  | Here is where you can register any plugins you'd like to use in your
  | project. Tailwind's built-in `container` plugin is enabled by default to
  | give you a Bootstrap-style responsive container component out of the box.
  |
  | Be sure to view the complete plugin documentation to learn more about how
  | the plugin system works.
  |
  */

  plugins: [
    require('tailwindcss/plugins/container')({
      // center: true,
      // padding: '1rem',
    }),
  ],

  /*
  |-----------------------------------------------------------------------------
  | Advanced Options         https://tailwindcss.com/docs/configuration#options
  |-----------------------------------------------------------------------------
  |
  | Here is where you can tweak advanced configuration options. We recommend
  | leaving these options alone unless you absolutely need to change them.
  |
  */

  options: {
    prefix: '',
    important: false,
    separator: ':',
  },

}
