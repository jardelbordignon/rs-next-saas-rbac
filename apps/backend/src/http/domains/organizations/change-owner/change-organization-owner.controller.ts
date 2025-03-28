import { z } from 'zod'
import { auth } from '@/http/middlewares'
import { changeOrganizationOwnerService } from './change-organization-owner.service'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

export async function changeOrganizationOwnerController(fastify: FastifyInstance) {
  fastify
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .patch(
      '/organizations/:slug/owner',
      {
        schema: {
          tags: ['Organizations'],
          summary: 'Change the owner of an organization',
          security: [{ bearerAuth: [] }],
          response: {
            204: z.null(),
            401: z.object({
              message: z
                .string()
                .default(
                  'You are not allowed to transfer ownership of this organization',
                ),
            }),
          },
          params: z.object({
            slug: z.string(),
          }),
          body: z.object({
            newOwnerId: z.string(),
          }),
        },
      },
      async (request, reply) => {
        const { slug } = request.params
        const { membership, organization, userId } =
          await request.getUserMembership(slug)

        await changeOrganizationOwnerService({
          userId,
          membership: { membership, organization },
          data: request.body,
        })

        return reply.status(204).send()
      },
    )
}
