import { Monitor, Moon, Sun } from 'lucide-react'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { useTheme, type Theme } from '@/hooks/use-theme'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { Button } from './ui/button'

const ThemeToggle = () => {
  const { theme, resolvedTheme, setTheme } = useTheme()
  const { t } = useTranslation('main')

  const getIcon = () => {
    if (theme === 'dark') return <Moon className="h-4 w-4" />
    if (theme === 'light') return <Sun className="h-4 w-4" />
    return <Monitor className="h-4 w-4" />
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9" aria-label={t('theme.title')}>
          {getIcon()}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuRadioGroup value={theme} onValueChange={(value) => setTheme(value as Theme)}>
          <DropdownMenuRadioItem value="auto">
            <div className="flex items-center gap-2">
              <Monitor className="h-4 w-4" />
              {t('theme.auto')}
            </div>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="light">
            <div className="flex items-center gap-2">
              <Sun className="h-4 w-4" />
              {t('theme.light')}
            </div>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="dark">
            <div className="flex items-center gap-2">
              <Moon className="h-4 w-4" />
              {t('theme.dark')}
            </div>
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ThemeToggle
