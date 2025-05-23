import { z } from 'zod'
import { updateMemberSchema } from '@/database/schema'
import { auth } from '@/http/middlewares'
import { updateMemberService } from './update-member.service'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

export async function updateMemberController(fastify: FastifyInstance) {
  fastify
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .put(
      '/organizations/:slug/members/:memberId',
      {
        schema: {
          tags: ['Members'],
          summary: 'Update a member of an organization',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
            memberId: z.string(),
          }),
          body: updateMemberSchema,
          response: {
            204: z.null(),
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
        },
      },
      async (request, reply) => {
        const { slug, memberId } = request.params
        const userMembership = await request.getUserMembership(slug)
        await updateMemberService({
          userMembership,
          memberId,
          data: request.body,
        })
        return reply.status(204).send()
      },
    )
}
