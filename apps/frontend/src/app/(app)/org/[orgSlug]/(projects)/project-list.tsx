import { ArrowRight } from 'lucide-react'
import { getCurrentOrgCookie } from '@/auth/auth'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui'
import {
  type GetOrganizationProjectsResponse,
  getOrganizationProjects,
} from '@/http/get-organization-projects'
import { relativeTime } from '@/lib/date'

export async function ProjectList() {
  const orgCookie = await getCurrentOrgCookie()
  let data: GetOrganizationProjectsResponse = []

  if (orgCookie) {
    data = await getOrganizationProjects(orgCookie)
  }

  return (
    <div className='grid grid-cols-3 gap-4'>
      {data.map(({ project, owner }) => (
        <Card key={project.id} className='flex flex-col justify-between'>
          <CardHeader>
            <CardTitle className='text-xl font-medium'>{project.name}</CardTitle>
            <CardDescription className='line-clamp-3 leading-relax'>
              {project.description}
            </CardDescription>
          </CardHeader>

          <CardFooter className='flex items-center gap-1.5'>
            <Avatar className='size-4'>
              <AvatarImage src={owner.avatarUrl} alt='Avatar' />
              <AvatarFallback />
            </Avatar>

            <span className='text-xs text-muted-foreground'>
              By <span className='font-medium text-foreground'>{owner.name}</span>{' '}
              {relativeTime(project.createdAt)}
            </span>

            <Button size='xs' variant='outline' className='ml-auto'>
              View <ArrowRight className='size-3 ml-2' />
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
