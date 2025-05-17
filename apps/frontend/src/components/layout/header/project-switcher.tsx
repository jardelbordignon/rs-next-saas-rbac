'use client'
import { useQuery } from '@tanstack/react-query'
import { ChevronsUpDown, Loader2, PlusCircle } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
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
import { Skeleton } from '@/components/ui'
import { getProjects } from '@/http/get-projects'

type RouteParams = {
  orgSlug: string
  projectSlug: string
}

export function ProjectSwitcher() {
  const { orgSlug, projectSlug } = useParams<RouteParams>()

  const { data, isLoading } = useQuery({
    queryKey: [orgSlug, 'projects'],
    queryFn: () => getProjects(orgSlug),
    enabled: !!orgSlug,
  })

  const currentProject =
    data && projectSlug
      ? data.find(({ project }) => project.slug === projectSlug)?.project
      : null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className='flex w-[168px] items-center gap-2 rounded p-1 text-sm font-medium outline-none focus-visible:right-2 focus-visible:ring-primary'>
        {isLoading ? (
          <>
            <Skeleton className='size-4 rounded-full shrink-0' />
            <Skeleton className='h-4 w-full' />
          </>
        ) : currentProject ? (
          <>
            <Avatar className='size-4'>
              {currentProject.avatarUrl && (
                <AvatarImage src={currentProject.avatarUrl} />
              )}
              <AvatarFallback />
            </Avatar>
            <span className='truncate text-left'>{currentProject.name}</span>
          </>
        ) : (
          <span className='text-muted-foreground'>Select project</span>
        )}
        {isLoading ? (
          <Loader2 className='ml-auto size-3 animate-spin text-muted-foreground shrink-0' />
        ) : (
          <ChevronsUpDown className='ml-auto size-3 text-muted-foreground shrink-0' />
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align='end'
        alignOffset={-16}
        sideOffset={12}
        className='w-[200px]'
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel>Projects</DropdownMenuLabel>
          {data?.map(({ project }) => (
            <DropdownMenuItem key={project.id} asChild>
              <Link href={`/org/${orgSlug}/project/${project.slug}`}>
                <Avatar>
                  {project.avatarUrl && <AvatarImage src={project.avatarUrl} />}
                  <AvatarFallback />
                </Avatar>
                <span className='line-clamp-1'>{project.name}</span>
              </Link>
            </DropdownMenuItem>
          ))}

          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href={`/org/${orgSlug}/create-project`}>
              <PlusCircle className='mr-2 size-5' />
              Create new
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
