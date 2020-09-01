import CFTheme from '../styles/theme'

export const ReactSelectStyles = {
  control: (base, { isFocused }) => ({
    ...base,
    cursor: 'text',
    ...(isFocused && {
      'border-color': '#6ba3a7',
      'box-shadow': '0 0 0 0.125em rgba(107, 163, 167, 0.25)',
    }),
  }),
  option: (base) => ({
    ...base,
    cursor: 'pointer',
  }),
}

export const ReactSelectTheme = (reactSelectTheme) => ({
  ...reactSelectTheme,
  colors: {
    ...reactSelectTheme.colors,
    primary: CFTheme.colors.primary,
  },
})
