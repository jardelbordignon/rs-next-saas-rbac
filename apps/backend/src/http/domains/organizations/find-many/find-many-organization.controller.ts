import { roleSchema } from '@repo/authorizations/src/roles'
import { z } from 'zod'
import { selectOrganizationSchema } from '@/database/schema'
import { auth } from '@/http/middlewares'
import { findManyOrganizationService } from './find-many-organization.service'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

const organizationWithRoleSchema = selectOrganizationSchema
  .pick({
    id: true,
    name: true,
    slug: true,
    avatarUrl: true,
  })
  .extend({
    role: roleSchema,
  })

export async function findManyOrganizationController(fastify: FastifyInstance) {
  fastify
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations',
      {
        schema: {
          tags: ['Organizations'],
          summary: 'Get organizations where the user is a member',
          security: [{ bearerAuth: [] }],
          response: {
            200: z.object({
              organizations: z.array(organizationWithRoleSchema),
            }),
          },
        },
      },
      async request => {
        const userId = await request.getCurrentUserId()
        const { organizations } = await findManyOrganizationService(userId)
        return { organizations }
      },
    )
}
