import { z } from 'zod'
import { auth } from '@/http/middlewares'
import { createOrganizationService } from './create-organization.service'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

export async function createOrganizationController(fastify: FastifyInstance) {
  fastify
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/organizations',
      {
        schema: {
          tags: ['Organizations'],
          summary: 'Create an organization',
          security: [{ bearerAuth: [] }],
          response: {
            201: z.object({
              organizationId: z.string(),
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
        const userId = await request.getCurrentUserId()
        const result = await createOrganizationService(userId, request.body)
        return reply.status(201).send(result)
      },
    )
}
