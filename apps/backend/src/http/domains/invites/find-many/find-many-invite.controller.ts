import { roleSchema } from '@repo/authorizations/src/roles'
import { z } from 'zod'
import { auth } from '@/http/middlewares'
import { findManyInviteService } from './find-many-invite.service'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

export async function findManyInviteController(fastify: FastifyInstance) {
  fastify
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations/:slug/invites',
      {
        schema: {
          params: z.object({
            slug: z.string(),
          }),
          summary: 'Get invites of an organization',
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
                    })
                    .nullable(),
                }),
              ),
            }),
          },
        },
      },
      async (request, reply) => {
        const { slug } = request.params
        const userMembership = await request.getUserMembership(slug)
        const result = await findManyInviteService(userMembership)
        return reply.status(200).send(result)
      },
    )
}
