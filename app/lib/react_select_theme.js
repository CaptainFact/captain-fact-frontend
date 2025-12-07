import React from 'react'
import AsyncSelect from 'react-select/async'
import AsyncCreatable from 'react-select/async-creatable'

import { useTheme } from '@/hooks/use-theme'

import CFTheme from '../styles/theme'

const createStyles = (darkMode) => ({
  control: (base, { isFocused }) => ({
    ...base,
    cursor: 'text',
    backgroundColor: darkMode ? 'hsl(0, 0%, 12%)' : base.backgroundColor,
    borderColor: darkMode ? 'hsl(0, 0%, 20%)' : base.borderColor,
    color: darkMode ? 'hsl(0, 0%, 98%)' : base.color,
    '&:hover': {
      borderColor: darkMode ? 'hsl(0, 0%, 25%)' : base['&:hover']?.borderColor || base.borderColor,
    },
    ...(isFocused && {
      'border-color': CFTheme.colors.primary,
      'box-shadow': '0 0 0 0.125em rgba(107, 163, 167, 0.25)',
    }),
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: darkMode ? 'hsl(0, 0%, 12%)' : base.backgroundColor,
    borderColor: darkMode ? 'hsl(0, 0%, 20%)' : base.borderColor,
  }),
  option: (base, { isFocused, isSelected }) => ({
    ...base,
    cursor: 'pointer',
    backgroundColor: isSelected
      ? darkMode
        ? 'hsl(0, 0%, 20%)'
        : base.backgroundColor
      : isFocused
        ? darkMode
          ? 'hsl(0, 0%, 18%)'
          : base.backgroundColor
        : darkMode
          ? 'hsl(0, 0%, 12%)'
          : base.backgroundColor,
    color: darkMode ? 'hsl(0, 0%, 98%)' : base.color,
    '&:active': {
      backgroundColor: darkMode
        ? 'hsl(0, 0%, 20%)'
        : base['&:active']?.backgroundColor || base.backgroundColor,
    },
  }),
  input: (base) => ({
    ...base,
    color: darkMode ? 'hsl(0, 0%, 98%)' : base.color,
  }),
  placeholder: (base) => ({
    ...base,
    color: darkMode ? 'hsl(0, 0%, 60%)' : base.color,
  }),
  singleValue: (base) => ({
    ...base,
    color: darkMode ? 'hsl(0, 0%, 98%)' : base.color,
  }),
})

const createWarningStyles = (darkMode) => ({
  control: (base, { isFocused }) => ({
    ...base,
    cursor: 'text',
    backgroundColor: darkMode ? 'hsl(0, 0%, 12%)' : base.backgroundColor,
    borderColor: CFTheme.colors.yellow,
    color: darkMode ? 'hsl(0, 0%, 98%)' : base.color,
    '&:hover': {
      borderColor: CFTheme.colors.yellow,
    },
    ...(isFocused && {
      'border-color': CFTheme.colors.yellow,
      'box-shadow': '0 0 0 0.125em rgba(107, 163, 167, 0.25)',
    }),
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: darkMode ? 'hsl(0, 0%, 12%)' : base.backgroundColor,
    borderColor: darkMode ? 'hsl(0, 0%, 20%)' : base.borderColor,
  }),
  option: (base, { isFocused, isSelected }) => ({
    ...base,
    cursor: 'pointer',
    backgroundColor: isSelected
      ? darkMode
        ? 'hsl(0, 0%, 20%)'
        : base.backgroundColor
      : isFocused
        ? darkMode
          ? 'hsl(0, 0%, 18%)'
          : base.backgroundColor
        : darkMode
          ? 'hsl(0, 0%, 12%)'
          : base.backgroundColor,
    color: darkMode ? 'hsl(0, 0%, 98%)' : base.color,
    '&:active': {
      backgroundColor: darkMode
        ? 'hsl(0, 0%, 20%)'
        : base['&:active']?.backgroundColor || base.backgroundColor,
    },
  }),
  input: (base) => ({
    ...base,
    color: darkMode ? 'hsl(0, 0%, 98%)' : base.color,
  }),
  placeholder: (base) => ({
    ...base,
    color: darkMode ? 'hsl(0, 0%, 60%)' : base.color,
  }),
  singleValue: (base) => ({
    ...base,
    color: darkMode ? 'hsl(0, 0%, 98%)' : base.color,
  }),
})

/**
 * Hook that returns reactive react-select styles based on current theme.
 * Styles will automatically update when theme changes.
 */
export const useReactSelectStyles = () => {
  const { resolvedTheme } = useTheme()
  const darkMode = resolvedTheme === 'dark'
  return createStyles(darkMode)
}

/**
 * Hook that returns reactive react-select warning styles based on current theme.
 * Styles will automatically update when theme changes.
 */
export const useReactSelectWarningStyles = () => {
  const { resolvedTheme } = useTheme()
  const darkMode = resolvedTheme === 'dark'
  return createWarningStyles(darkMode)
}

export const ReactSelectTheme = (reactSelectTheme) => ({
  ...reactSelectTheme,
  colors: {
    ...reactSelectTheme.colors,
    primary: CFTheme.colors.primary,
  },
})

// Wrapper components for class components that can't use hooks directly

/**
 * Wrapper for AsyncCreatable that uses reactive styles
 */
export const ReactiveAsyncCreatable = React.forwardRef((props, ref) => {
  const styles = useReactSelectStyles()
  return <AsyncCreatable {...props} styles={props.styles || styles} ref={ref} />
})
ReactiveAsyncCreatable.displayName = 'ReactiveAsyncCreatable'

/**
 * Wrapper for AsyncSelect that uses reactive styles
 */
export const ReactiveAsyncSelect = React.forwardRef((props, ref) => {
  const styles = useReactSelectStyles()
  return <AsyncSelect {...props} styles={props.styles || styles} ref={ref} />
})
ReactiveAsyncSelect.displayName = 'ReactiveAsyncSelect'
