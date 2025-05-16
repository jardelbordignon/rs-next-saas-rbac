'use client'

import { QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from 'next-themes'
import { Toaster } from '@/components/ui/sonner'
import { queryClient } from '@/lib/react-query'

type Props = Readonly<{
  children: React.ReactNode
}>

export function Providers({ children }: Props) {
  return (
    <>
      <ThemeProvider
        attribute='class'
        defaultTheme='system'
        disableTransitionOnChange
      >
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </ThemeProvider>
      <Toaster position='top-center' />
    </>
  )
}
