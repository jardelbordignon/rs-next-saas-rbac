import { projectSchema } from '@repo/authorizations'
import { and, database, eq } from '@/database'
import {
  type SelectMember,
  type SelectOrganization,
  projects,
  users,
} from '@/database/schema'
import { NotFoundError, UnauthorizedError } from '@/http/errors'
import { getUserPermissions } from '@/utils'

type Membership = {
  userId: string
  organization: SelectOrganization
  membership: SelectMember
}

export async function findOneProjectService(
  projectSlug: string,
  { membership, organization, userId }: Membership,
) {
  const { cannot } = getUserPermissions(userId, membership.role)

  if (cannot('get', 'Project')) {
    throw new UnauthorizedError('You are not allowed to see projects')
  }

  const [projectByOrganizationAndSlug] = await database
    .select()
    .from(projects)
    .where(
      and(
        eq(projects.organizationId, organization.id),
        eq(projects.slug, projectSlug),
      ),
    )
    .innerJoin(users, eq(projects.ownerId, users.id))
    .limit(1)

  if (!projectByOrganizationAndSlug) {
    throw new NotFoundError('Project not found')
  }

  const { projects: project, users: owner } = projectByOrganizationAndSlug

  const authProject = projectSchema.parse({ id: project.id, ownerId: owner.id })

  if (cannot('get', authProject)) {
    throw new UnauthorizedError('You are not allowed to see this project')
  }

  return { project, owner }
}
