import { useEffect, useState } from 'react'
import { getFromLocalStorage, LOCAL_STORAGE_KEYS, setLocalStorage } from '@/lib/local_storage'

export type Theme = 'auto' | 'dark' | 'light'

/**
 * Hook to manage theme preference with localStorage persistence and prefers-color-scheme support
 */
export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'auto'
    const stored = getFromLocalStorage(LOCAL_STORAGE_KEYS.THEME, 'auto') as Theme
    return stored === 'dark' || stored === 'light' || stored === 'auto' ? stored : 'auto'
  })

  const [resolvedTheme, setResolvedTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window === 'undefined') return 'light'
    if (theme === 'dark') return 'dark'
    if (theme === 'light') return 'light'
    // Auto mode: check prefers-color-scheme
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })

  // Update resolved theme when theme preference changes
  useEffect(() => {
    if (theme === 'dark') {
      setResolvedTheme('dark')
    } else if (theme === 'light') {
      setResolvedTheme('light')
    } else {
      // Auto mode: listen to prefers-color-scheme changes
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const updateResolvedTheme = () => {
        setResolvedTheme(mediaQuery.matches ? 'dark' : 'light')
      }
      updateResolvedTheme()
      mediaQuery.addEventListener('change', updateResolvedTheme)
      return () => mediaQuery.removeEventListener('change', updateResolvedTheme)
    }
  }, [theme])

  // Apply theme class to html element
  useEffect(() => {
    const root = document.documentElement
    if (resolvedTheme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [resolvedTheme])

  // Persist theme preference to localStorage
  const updateTheme = (newTheme: Theme) => {
    setTheme(newTheme)
    setLocalStorage(LOCAL_STORAGE_KEYS.THEME, newTheme)
  }

  return { theme, resolvedTheme, setTheme: updateTheme }
}
