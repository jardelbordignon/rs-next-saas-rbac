'use client'
import { useQuery } from '@tanstack/react-query'
import { ChevronsUpDown, PlusCircle } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { use } from 'react'
import { getCurrentOrgCookie } from '@/auth/auth'
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
import { getProjects } from '@/http/get-projects'

export function ProjectSwitcher() {
  const { slug: orgSlug } = useParams<{ slug: string }>()

  const { data, isLoading } = useQuery({
    queryKey: [orgSlug, 'projects'],
    queryFn: () => getProjects(orgSlug),
    enabled: !!orgSlug,
  })

  console.log(data)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className='flex w-[168px] items-center gap-2 rounded p-1 text-sm font-medium outline-none focus-visible:right-2 focus-visible:ring-primary'>
        {/* {currentOrganization ? (
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
        )} */}
        <ChevronsUpDown className='ml-auto size-3 text-muted-foreground' />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align='end'
        alignOffset={-16}
        sideOffset={12}
        className='w-[200px]'
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel>Projects</DropdownMenuLabel>
          {/* {organizations.map(({ avatarUrl, name, slug }) => (
            <DropdownMenuItem key={slug} asChild>
              <Link href={`/org/${slug}`}>
                <Avatar>
                  {avatarUrl && <AvatarImage src={avatarUrl} />}
                  <AvatarFallback />
                </Avatar>
                <span className='line-clamp-1'>{name}</span>
              </Link>
            </DropdownMenuItem>
          ))} */}

          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href='/create-project'>
              <PlusCircle className='mr-2 size-5' />
              Create new
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
