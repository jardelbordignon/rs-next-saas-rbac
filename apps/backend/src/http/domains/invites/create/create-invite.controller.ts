import { z } from 'zod'
import { insertInviteSchema } from '@/database/schema'
import { auth } from '@/http/middlewares'
import { createInviteService } from './create-invite.service'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

export async function createInviteController(fastify: FastifyInstance) {
  fastify
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/organizations/:slug/invites',
      {
        schema: {
          params: z.object({
            slug: z.string(),
          }),
          body: insertInviteSchema.pick({ email: true, role: true }),
          summary: 'Create an invite of an organization',
          tags: ['Invites'],
          security: [{ bearerAuth: [] }],
          response: {
            201: z.object({
              inviteId: z.string(),
            }),
            401: z.object({
              message: z
                .string()
                .default('You are not allowed to create new invites'),
            }),
          },
        },
      },
      async (request, reply) => {
        const { slug } = request.params
        const userMembership = await request.getUserMembership(slug)
        const result = await createInviteService(userMembership, request.body)
        return reply.status(201).send(result)
      },
    )
}
