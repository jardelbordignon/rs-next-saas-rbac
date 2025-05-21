import { Slash } from 'lucide-react'
import Image from 'next/image'
import { logoIcon } from '@/assets'
import { ability } from '@/auth/auth'
import { Separator } from '@/components/ui'
import { OrganizationSwitcher } from './organization-switcher'
import { ProfileButton } from './profile-button'
import { ProjectSwitcher } from './project-switcher'
import { ThemeSwitcher } from './theme-switcher'

export async function Header() {
  const permissions = await ability()

  return (
    <header className='flex items-center justify-between w-full'>
      <div className='flex items-center gap-3'>
        <Image src={logoIcon} className='size-6 dark:invert' alt='SaaS App' />
        <Slash className='size-3 -rotate-[24deg] text-border' />
        <OrganizationSwitcher />
        {permissions?.can('get', 'Project') && (
          <>
            <Slash className='size-3 -rotate-[24deg] text-border' />
            <ProjectSwitcher />
          </>
        )}
      </div>

      <div className='flex items-center gap-4'>
        <ThemeSwitcher />
        <Separator orientation='vertical' className='h-5' />
        <ProfileButton />
      </div>
    </header>
  )
}
