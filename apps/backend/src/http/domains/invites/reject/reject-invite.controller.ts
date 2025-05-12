import { z } from 'zod'
import { insertInviteSchema } from '@/database/schema'
import { rejectInviteService } from './reject-invite.service'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

export async function rejectInviteController(fastify: FastifyInstance) {
  fastify.withTypeProvider<ZodTypeProvider>().post(
    '/invites/:inviteId/reject',
    {
      schema: {
        params: z.object({
          inviteId: z.string(),
        }),
        body: insertInviteSchema.pick({ email: true, role: true }),
        summary: 'Reject an invite',
        tags: ['Invites'],
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
      await rejectInviteService({ inviteId, userId })
      return reply.status(204).send()
    },
  )
}
