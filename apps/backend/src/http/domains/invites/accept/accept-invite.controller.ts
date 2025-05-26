import { z } from 'zod'
import { auth } from '@/http/middlewares'
import { acceptInviteService } from './accept-invite.service'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

export async function acceptInviteController(fastify: FastifyInstance) {
  fastify
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/invites/:inviteId/accept',
      {
        schema: {
          params: z.object({
            inviteId: z.string(),
          }),
          summary: 'Accept an invite',
          tags: ['Invites'],
          security: [{ bearerAuth: [] }],
          response: {
            201: z.object({
              inviteId: z.string(),
            }),
          },
        },
      },
      async (request, reply) => {
        const { inviteId } = request.params
        const userId = await request.getCurrentUserId()
        await acceptInviteService({ inviteId, userId })
        return reply.status(204).send()
      },
    )
}
