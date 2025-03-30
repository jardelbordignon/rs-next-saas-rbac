import { projectSchema } from '@repo/authorizations'
import { and, database, eq } from '@/database'
import {
  type InsertProject,
  type SelectMember,
  type SelectOrganization,
  projects,
} from '@/database/schema'
import { NotFoundError, UnauthorizedError } from '@/http/errors'
import { type MakeOptional, getUserPermissions } from '@/utils'

type Membership = {
  userId: string
  organization: SelectOrganization
  membership: SelectMember
}

export type CreateProjectData = MakeOptional<InsertProject, 'slug'>

export async function deleteProjectService(
  projectId: string,
  { membership, organization, userId }: Membership,
) {
  const { cannot } = getUserPermissions(userId, membership.role)

  if (cannot('delete', 'Project')) {
    throw new UnauthorizedError('You are not allowed to delete projects')
  }

  const [project] = await database
    .select()
    .from(projects)
    .where(
      and(eq(projects.id, projectId), eq(projects.organizationId, organization.id)),
    )
    .limit(1)

  if (!project) {
    throw new NotFoundError('Project not found')
  }

  const projectAuthorizations = projectSchema.parse(project)

  if (cannot('delete', projectAuthorizations)) {
    throw new UnauthorizedError('You are not allowed to delete this project')
  }

  await database.delete(projects).where(eq(projects.id, projectId))
}
