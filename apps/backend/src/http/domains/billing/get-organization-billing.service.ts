import { count, database, eq } from '@/database'
import { members, projects } from '@/database/schema'
import { UnauthorizedError } from '@/http/errors'
import { getUserPermissions } from '@/utils'
import type { Membership } from 'fastify'

export async function getOrganizationBillingService({
  membership,
  organization,
  userId,
}: Membership) {
  const { cannot } = getUserPermissions(userId, membership.role)

  if (cannot('get', 'Billing')) {
    throw new UnauthorizedError('You are not allowed to get billing information')
  }

  if (cannot('get', 'Billing', organization.id)) {
    throw new UnauthorizedError(
      'You are not allowed to get billing information from this organization',
    )
  }

  const [[membersCount], [projectsCount]] = await Promise.all([
    database
      .select({ count: count() })
      .from(members)
      .where(eq(members.organizationId, organization.id)),

    database
      .select({ count: count() })
      .from(projects)
      .where(eq(projects.organizationId, organization.id)),
  ])

  const seatUnit = 10
  const projectUnit = 20
  const seatsPrice = membersCount.count * seatUnit
  const projectsPrice = projectsCount.count * projectUnit
  const total = seatsPrice + projectsPrice

  return {
    billing: {
      seats: {
        amount: membersCount.count,
        price: seatsPrice,
        unit: seatUnit,
      },
      projects: {
        amount: projectsCount.count,
        price: projectsPrice,
        unit: projectUnit,
      },
      total,
    },
  }
}
