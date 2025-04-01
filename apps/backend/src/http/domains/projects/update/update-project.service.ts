import { projectSchema } from '@repo/authorizations'
import { and, database, eq, ne } from '@/database'
import {
  type SelectMember,
  type SelectOrganization,
  type UpdateProject,
  projects,
} from '@/database/schema'
import { ConflictError, NotFoundError, UnauthorizedError } from '@/http/errors'
import { getUserPermissions, slugify } from '@/utils'

type Membership = {
  userId: string
  organization: SelectOrganization
  membership: SelectMember
}

export type UpdateProjectData = Omit<UpdateProject, 'organizationId' | 'ownerId'>

export async function updateProjectService(
  projectId: string,
  { membership, userId }: Membership,
  { name, description, avatarUrl, isPrivate, slug }: UpdateProjectData,
) {
  const { cannot } = getUserPermissions(userId, membership.role)

  if (cannot('update', 'Project')) {
    throw new UnauthorizedError('You are not allowed to update projects')
  }

  const [project] = await database
    .select({ id: projects.id, ownerId: projects.ownerId })
    .from(projects)
    .where(eq(projects.id, projectId))
    .limit(1)

  if (!project) {
    throw new NotFoundError('Project not found')
  }

  const authProject = projectSchema.parse(project)

  if (cannot('update', authProject)) {
    throw new UnauthorizedError('You are not allowed to update this project')
  }

  const projectSlug = slug ? slugify(slug) : undefined

  if (projectSlug) {
    const [projectBySlug] = await database
      .select({ id: projects.id })
      .from(projects)
      .where(and(eq(projects.slug, projectSlug), ne(projects.id, projectId)))
      .limit(1)

    if (projectBySlug) {
      throw new ConflictError(
        'A project with this slug already exists. Try another slug',
      )
    }
  }

  await database
    .update(projects)
    .set({
      name,
      slug: projectSlug,
      description,
      avatarUrl,
      isPrivate,
    })
    .where(eq(projects.id, projectId))

  return
}
