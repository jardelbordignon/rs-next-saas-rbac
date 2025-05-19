import { z } from 'zod'
import { auth } from '@/http/middlewares'
import { deleteMemberService } from './remove-member.service'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

export async function removeMemberController(fastify: FastifyInstance) {
  fastify
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .delete(
      '/organizations/:slug/members/:memberId',
      {
        schema: {
          tags: ['Members'],
          summary: 'Remove a member of an organization',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
            memberId: z.string(),
          }),
          response: {
            204: z.null(),
            401: z.object({
              message: z
                .string()
                .default('You are not allowed to remove organization members'),
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
        await deleteMemberService({
          userMembership,
          memberId,
        })
        return reply.status(204).send()
      },
    )
}
