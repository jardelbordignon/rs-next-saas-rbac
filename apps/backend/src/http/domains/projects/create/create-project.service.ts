import { database } from '@/database'
import {
  type InsertProject,
  type SelectMember,
  type SelectOrganization,
  projects,
} from '@/database/schema'
import { UnauthorizedError } from '@/http/errors'
import { type MakeOptional, getUserPermissions, slugify } from '@/utils'

type Membership = {
  userId: string
  organization: SelectOrganization
  membership: SelectMember
}

export type CreateProjectData = MakeOptional<InsertProject, 'slug'>

export async function createProjectService(
  { membership, organization, userId }: Membership,
  { name, description, avatarUrl, isPrivate, slug }: CreateProjectData,
) {
  const { cannot } = getUserPermissions(userId, membership.role)

  if (cannot('create', 'Project')) {
    throw new UnauthorizedError('You are not allowed to create new projects')
  }

  const [project] = await database
    .insert(projects)
    .values({
      name,
      slug: slugify(slug ?? name),
      description,
      avatarUrl,
      isPrivate,
      organizationId: organization.id,
      ownerId: userId,
    })
    .returning({ id: projects.id })

  return { projectId: project.id }
}
