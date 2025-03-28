import { z } from 'zod'
import { auth } from '@/http/middlewares'
import { deleteOrganizationService } from './delete-organization.service'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

export async function deleteOrganizationController(fastify: FastifyInstance) {
  fastify
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .delete(
      '/organizations/:slug',
      {
        schema: {
          tags: ['Organizations'],
          summary: 'Delete an organization',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          response: {
            204: z.null(),
            401: z.object({
              message: z.string(),
            }),
          },
        },
      },
      async (request, reply) => {
        const { slug } = request.params
        const { membership, organization, userId } =
          await request.getUserMembership(slug)

        await deleteOrganizationService({
          userId,
          membership: { membership, organization },
        })

        return reply.status(204).send()
      },
    )
}
