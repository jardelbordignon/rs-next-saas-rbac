import { ability, getCurrentOrgCookie } from '@/auth/auth'
import { NavLink } from '@/components/common/nav-link'
import { Button } from '@/components/ui'

export async function Tabs() {
  const orgCookie = await getCurrentOrgCookie()
  const permissions = await ability()

  const canGetProjects = permissions?.can('get', 'Project')
  const canGetMembers = permissions?.can('get', 'User')
  const canUpdateOrganization = permissions?.can('update', 'Organization')
  const canGetBilling = permissions?.can('get', 'Billing')

  return (
    <div className='border-b py-4'>
      <nav className='flex items-center gap-2'>
        {canGetProjects && (
          <Button
            variant='ghost'
            size='sm'
            className='border border-transparent text-muted-foreground data-[current=true]:text-foreground data-[current=true]:border-border'
            asChild
          >
            <NavLink href={`/org/${orgCookie}`}>Projects</NavLink>
          </Button>
        )}
        {canGetMembers && (
          <Button
            variant='ghost'
            size='sm'
            className='border border-transparent text-muted-foreground data-[current=true]:text-foreground data-[current=true]:border-border'
            asChild
          >
            <NavLink href={`/org/${orgCookie}/members`}>Members</NavLink>
          </Button>
        )}
        {(canUpdateOrganization || canGetBilling) && (
          <Button
            variant='ghost'
            size='sm'
            className='border border-transparent text-muted-foreground data-[current=true]:text-foreground data-[current=true]:border-border'
            asChild
          >
            <NavLink href={`/org/${orgCookie}/settings`}>Settings & Billing</NavLink>
          </Button>
        )}
      </nav>
    </div>
  )
}
