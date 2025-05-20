import { z } from 'zod'
import { auth } from '@/http/middlewares'
import { revokeInviteService } from './revoke-invite.service'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

export async function revokeInviteController(fastify: FastifyInstance) {
  fastify
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .delete(
      '/organizations/:slug/invites/:inviteId',
      {
        schema: {
          params: z.object({
            slug: z.string(),
            inviteId: z.string(),
          }),
          summary: 'Revoke an invite',
          tags: ['Invites'],
          security: [{ bearerAuth: [] }],
          response: {
            204: z.null(),
            401: z.object({
              message: z.string().default('You are not allowed to delete an invite'),
            }),
          },
        },
      },
      async (request, reply) => {
        const { inviteId, slug } = request.params
        const userMembership = await request.getUserMembership(slug)
        await revokeInviteService(userMembership, inviteId)
        return reply.status(204).send()
      },
    )
}
