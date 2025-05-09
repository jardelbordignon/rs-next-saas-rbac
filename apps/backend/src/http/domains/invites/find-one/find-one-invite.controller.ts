import { roleSchema } from '@repo/authorizations/src/roles'
import { z } from 'zod'
import { findOneInviteService } from './find-one-invite.service'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

export async function findOneInviteController(fastify: FastifyInstance) {
  fastify.withTypeProvider<ZodTypeProvider>().get(
    '/invites/:inviteId',
    {
      schema: {
        params: z.object({
          inviteId: z.string(),
        }),
        summary: 'Get an invite',
        tags: ['Invites'],
        response: {
          200: z.object({
            invite: z.object({
              id: z.string(),
              email: z.string().email(),
              role: roleSchema,
              createdAt: z.date(),
              author: z
                .object({
                  id: z.string(),
                  name: z.string().nullable().nullable(),
                  avatarUrl: z.string().nullable().nullable(),
                })
                .nullable(),
              organization: z.object({
                id: z.string(),
                name: z.string(),
                avatarUrl: z.string().nullable(),
              }),
            }),
          }),
        },
      },
    },
    async (request, reply) => {
      const { inviteId } = request.params
      const result = await findOneInviteService(inviteId)
      return reply.status(200).send(result)
    },
  )
}
