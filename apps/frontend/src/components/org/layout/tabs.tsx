import { getCurrentOrgCookie } from '@/auth/auth'
import { NavLink } from '@/components/common/nav-link'
import { Button } from '@/components/ui'

export async function Tabs() {
  const orgCookie = await getCurrentOrgCookie()

  return (
    <div className='border-b py-4'>
      <nav className='flex items-center gap-2'>
        <Button
          variant='ghost'
          size='sm'
          className='border border-transparent text-muted-foreground data-[current=true]:text-foreground data-[current=true]:border-border'
          asChild
        >
          <NavLink href={`/org/${orgCookie}`}>Projects</NavLink>
        </Button>
        <Button
          variant='ghost'
          size='sm'
          className='border border-transparent text-muted-foreground data-[current=true]:text-foreground data-[current=true]:border-border'
          asChild
        >
          <NavLink href={`/org/${orgCookie}/members`}>Members</NavLink>
        </Button>
        <Button
          variant='ghost'
          size='sm'
          className='border border-transparent text-muted-foreground data-[current=true]:text-foreground data-[current=true]:border-border'
          asChild
        >
          <NavLink href={`/org/${orgCookie}/settings`}>Settings & Billing</NavLink>
        </Button>
      </nav>
    </div>
  )
}
