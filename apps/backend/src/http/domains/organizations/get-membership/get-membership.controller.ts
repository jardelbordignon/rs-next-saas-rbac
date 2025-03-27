import { z } from 'zod'
import { auth } from '@/http/middlewares'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

export async function getMembershipController(fastify: FastifyInstance) {
  fastify
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations/:slug/membership',
      {
        schema: {
          tags: ['Organizations'],
          summary: 'Get user membership of an organization',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          response: {
            200: z.object({
              membership: z.object({
                id: z.string(),
                role: z.enum(['ADMIN', 'MEMBER', 'BILLING']),
                organizationId: z.string(),
              }),
            }),
          },
        },
      },
      async request => {
        const { slug } = request.params
        const { membership } = await request.getUserMembership(slug)
        return { membership }
      },
    )
}
