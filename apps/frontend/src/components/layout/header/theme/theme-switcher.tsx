'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui'

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()
  const Icon = theme === 'light' ? Sun : Moon

  function toggleTheme() {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  return (
    <Button variant='ghost' size='icon' onClick={toggleTheme}>
      <Icon className='size-4' />
      <span className='sr-only'>Toggle theme</span>
    </Button>
  )
}
