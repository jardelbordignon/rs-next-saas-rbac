import { type FastifyInstance } from 'fastify'
import { fastifyPlugin } from 'fastify-plugin'
import { and, database, eq } from '@/database'
import { members, organizations } from '@/database/schema'
import { NotFoundError, UnauthorizedError } from '../errors'

export const auth = fastifyPlugin(async (app: FastifyInstance) => {
  app.addHook('preHandler', async request => {
    request.getCurrentUserId = async () => {
      try {
        const { sub } = await request.jwtVerify<{ sub: string }>()
        return sub
      } catch {
        throw new UnauthorizedError('Invalid auth token')
      }
    }

    request.getUserMembership = async (slug: string) => {
      const userId = await request.getCurrentUserId()

      const [organizationBySlug] = await database
        .select()
        .from(organizations)
        .where(eq(organizations.slug, slug))
        .limit(1)

      if (!organizationBySlug) {
        throw new NotFoundError('Organization not found by this slug')
      }

      const [membership] = await database
        .select()
        .from(members)
        .where(
          and(
            eq(members.userId, userId),
            eq(members.organizationId, organizationBySlug.id),
          ),
        )
        .limit(1)

      if (!membership) {
        throw new UnauthorizedError('You are not a member of this organization')
      }

      return {
        userId,
        organization: organizationBySlug,
        membership,
      }
    }
  })
})
