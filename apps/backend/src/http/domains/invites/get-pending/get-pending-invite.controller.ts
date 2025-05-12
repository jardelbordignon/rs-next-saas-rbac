import { roleSchema } from '@repo/authorizations/src/roles'
import { z } from 'zod'
import { auth } from '@/http/middlewares'
import { getPendingInviteService } from './get-pending-invite.service'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

export async function getPendingInviteController(fastify: FastifyInstance) {
  fastify
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/invites/pending',
      {
        schema: {
          summary: 'Get pending invites',
          tags: ['Invites'],
          security: [{ bearerAuth: [] }],
          response: {
            200: z.object({
              invites: z.array(
                z.object({
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
              ),
            }),
          },
        },
      },
      async (request, reply) => {
        const userId = await request.getCurrentUserId()
        const result = await getPendingInviteService(userId)
        return reply.status(200).send(result)
      },
    )
}
