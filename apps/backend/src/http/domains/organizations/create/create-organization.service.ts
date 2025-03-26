import { eq } from 'drizzle-orm'
import { database } from '@/database'
import { members, organizations } from '@/database/schema'
import { ConflictError } from '@/http/errors'
import { slugify } from '@/utils/slugify'

type CreateOrganizationServiceDto = {
  name: string
  domain?: string
  shouldAttachUsersByDomain?: boolean
}

export async function createOrganizationService(
  userId: string,
  { name, domain, shouldAttachUsersByDomain }: CreateOrganizationServiceDto,
) {
  if (domain) {
    const [organizationByDomain] = await database
      .select({ id: organizations.id })
      .from(organizations)
      .where(eq(organizations.domain, domain))
      .limit(1)

    if (organizationByDomain) {
      throw new ConflictError('An organization already exists with this domain')
    }
  }

  return database.transaction(async tx => {
    const [organization] = await tx
      .insert(organizations)
      .values({
        name,
        slug: slugify(name),
        domain,
        shouldAttachUsersByDomain,
        ownerId: userId,
      })
      .returning({ id: organizations.id })

    await tx.insert(members).values({
      userId,
      organizationId: organization.id,
      role: 'ADMIN',
    })

    return { organizationId: organization.id }
  })
}
