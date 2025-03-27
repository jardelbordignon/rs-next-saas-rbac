import { type FastifyInstance } from 'fastify'
import { fastifyPlugin } from 'fastify-plugin'
import { database, eq } from '@/database'
import { members, organizations } from '@/database/schema'
import { UnauthorizedError } from '../errors'

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

      const [membership] = await database
        .select()
        .from(members)
        .where(eq(members.userId, userId))
        .innerJoin(organizations, eq(organizations.slug, slug))
        .limit(1)

      if (!membership) {
        throw new UnauthorizedError('You are not a member of this organization')
      }

      return {
        organization: membership.organizations,
        membership: membership.members,
      }
    }
  })
})
