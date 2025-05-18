'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ComponentProps } from 'react'

export function NavLink(props: ComponentProps<typeof Link>) {
  const pathname = usePathname()

  return <Link data-current={pathname === props.href} {...props} />
}
