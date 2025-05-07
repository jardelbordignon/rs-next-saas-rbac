import { roleSchema } from '@repo/authorizations/src/roles'
import { z } from 'zod'
import { auth } from '@/http/middlewares'
import { findManyMemberService } from './find-many-member.service'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

export async function findManyMemberController(fastify: FastifyInstance) {
  fastify
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations/:slug/members',
      {
        schema: {
          tags: ['Members'],
          summary: 'Find members of an organization',
          security: [{ bearerAuth: [] }],
          response: {
            200: z.object({
              members: z.array(
                z.object({
                  id: z.string(),
                  role: roleSchema,
                  userId: z.string(),
                  name: z.string().nullable(),
                  email: z.string().email(),
                  avatarUrl: z.string().url().nullable(),
                }),
              ),
            }),
            401: z.object({
              message: z
                .string()
                .default('You are not allowed to see organization members'),
            }),
            404: z.object({
              message: z
                .string()
                .default('There are no members in this organization'),
            }),
          },
          params: z.object({
            slug: z.string(),
          }),
        },
      },
      async (request, reply) => {
        const { slug } = request.params
        const userMembership = await request.getUserMembership(slug)
        const result = await findManyMemberService(userMembership)
        return reply.status(200).send(result)
      },
    )
}
