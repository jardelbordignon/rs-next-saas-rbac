import { database, desc, eq } from '@/database'
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

export async function findManyProjectService({
  membership,
  organization,
  userId,
}: Membership) {
  const { cannot } = getUserPermissions(userId, membership.role)

  if (cannot('get', 'Project')) {
    throw new UnauthorizedError('You are not allowed to see projects')
  }

  const projectsByOrganization = await database
    .select()
    .from(projects)
    .where(eq(projects.organizationId, organization.id))
    .innerJoin(users, eq(projects.ownerId, users.id))
    .orderBy(desc(projects.createdAt))

  if (!projectsByOrganization.length) {
    throw new NotFoundError('There are no projects in this organization')
  }

  return projectsByOrganization.map(register => {
    return {
      owner: register.users,
      project: register.projects,
    }
  })
}
