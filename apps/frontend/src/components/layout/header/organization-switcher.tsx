import { ChevronsUpDown, PlusCircle } from 'lucide-react'
import { cookies } from 'next/headers'
import Link from 'next/link'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui'
import { getOrganizations } from '@/http/get-organizations'

export async function OrganizationSwitcher() {
  const { organizations } = await getOrganizations()
  const { get } = await cookies()
  const orgCookie = get('org')?.value
  const currentOrganization = organizations.find(org => org.slug === orgCookie)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className='flex w-[168px] items-center gap-2 rounded p-1 text-sm font-medium outline-none focus-visible:right-2 focus-visible:ring-primary'>
        {currentOrganization ? (
          <>
            <Avatar className='mr-2 size-4'>
              {currentOrganization.avatarUrl && (
                <AvatarImage src={currentOrganization.avatarUrl} />
              )}
              <AvatarFallback />
            </Avatar>
            <span className='truncate text-left'>{currentOrganization.name}</span>
          </>
        ) : (
          <span className='text-muted-foreground'>Select organization</span>
        )}
        <ChevronsUpDown className='ml-auto size-3 text-muted-foreground' />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align='end'
        alignOffset={-16}
        sideOffset={12}
        className='w-[200px]'
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel>Organizations</DropdownMenuLabel>
          {organizations.map(({ avatarUrl, name, slug }) => (
            <DropdownMenuItem key={slug} asChild>
              <Link href={`/org/${slug}`}>
                <Avatar>
                  {avatarUrl && <AvatarImage src={avatarUrl} />}
                  <AvatarFallback />
                </Avatar>
                <span className='line-clamp-1'>{name}</span>
              </Link>
            </DropdownMenuItem>
          ))}

          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href='/create-organization'>
              <PlusCircle className='mr-2 size-5' />
              Create new
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
