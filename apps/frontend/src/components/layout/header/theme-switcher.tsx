'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui'

export function ThemeSwitcher() {
  const { resolvedTheme, setTheme } = useTheme()

  function toggleTheme() {
    setTheme(resolvedTheme === 'light' ? 'dark' : 'light')
  }

  return (
    <Button variant='ghost' size='icon' onClick={toggleTheme}>
      <Sun className='inline dark:hidden size-4' />
      <Moon className='hidden dark:inline size-4' />
      <span className='sr-only'>Toggle theme</span>
    </Button>
  )
}
