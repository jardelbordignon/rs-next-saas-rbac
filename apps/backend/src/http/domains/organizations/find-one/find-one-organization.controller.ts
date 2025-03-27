import { z } from 'zod'
import { selectOrganizationSchema } from '@/database/schema'
import { auth } from '@/http/middlewares'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

export async function findOneOrganizationController(fastify: FastifyInstance) {
  fastify
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations/:slug',
      {
        schema: {
          tags: ['Organizations'],
          summary: 'Get details of an organization',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          response: {
            200: z.object({
              organization: selectOrganizationSchema,
            }),
          },
        },
      },
      async request => {
        const { slug } = request.params
        const { organization } = await request.getUserMembership(slug)
        return { organization }
      },
    )
}
