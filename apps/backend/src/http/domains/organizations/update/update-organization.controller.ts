import { z } from 'zod'
import { auth } from '@/http/middlewares'
import { updateOrganizationService } from './update-organization.service'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

export async function updateOrganizationController(fastify: FastifyInstance) {
  fastify
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .put(
      '/organizations/:slug',
      {
        schema: {
          tags: ['Organizations'],
          summary: 'Create an organization',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          response: {
            204: z.null(),
            401: z.object({
              message: z
                .string()
                .default('You are not allowed to update this organization'),
            }),
            409: z.object({
              message: z
                .string()
                .default('An organization already exists with this domain'),
            }),
          },
          body: z.object({
            name: z.string(),
            domain: z.string().optional(),
            shouldAttachUsersByDomain: z.boolean().optional(),
          }),
        },
      },
      async (request, reply) => {
        const { slug } = request.params
        const { membership, organization, userId } =
          await request.getUserMembership(slug)

        await updateOrganizationService({
          userId,
          membership: { membership, organization },
          data: request.body,
        })

        return reply.status(204).send()
      },
    )
}
