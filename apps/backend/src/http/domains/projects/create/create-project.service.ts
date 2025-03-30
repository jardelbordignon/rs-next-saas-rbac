import { database, eq } from '@/database'
import {
  type InsertProject,
  type SelectMember,
  type SelectOrganization,
  projects,
} from '@/database/schema'
import { ConflictError, UnauthorizedError } from '@/http/errors'
import { type MakeOptional, getUserPermissions, slugify } from '@/utils'

type Membership = {
  userId: string
  organization: SelectOrganization
  membership: SelectMember
}

export type CreateProjectData = MakeOptional<
  Omit<InsertProject, 'organizationId' | 'ownerId'>,
  'slug'
>

export async function createProjectService(
  { membership, organization, userId }: Membership,
  { name, description, avatarUrl, isPrivate, slug }: CreateProjectData,
) {
  const { cannot } = getUserPermissions(userId, membership.role)

  if (cannot('create', 'Project')) {
    throw new UnauthorizedError('You are not allowed to create new projects')
  }

  const projectSlug = slugify(slug ?? name)

  const [projectBySlug] = await database
    .select({ id: projects.id })
    .from(projects)
    .where(eq(projects.slug, projectSlug))
    .limit(1)

  if (projectBySlug) {
    const message = slug
      ? 'A project with this slug already exists. Try another slug or try generate from project name'
      : 'A project with this generated slug already exists. Try another project name or enter a custom slug'
    throw new ConflictError(message)
  }

  const [project] = await database
    .insert(projects)
    .values({
      name,
      slug: projectSlug,
      description,
      avatarUrl,
      isPrivate,
      organizationId: organization.id,
      ownerId: userId,
    })
    .returning({ id: projects.id })

  return { projectId: project.id }
}
