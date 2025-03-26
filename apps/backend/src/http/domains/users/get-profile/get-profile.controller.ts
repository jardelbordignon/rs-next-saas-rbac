import { z } from 'zod'
import { auth } from '@/http/middlewares'
import { getProfileService } from './get-profile.service'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

export async function getProfileController(fastify: FastifyInstance) {
  fastify
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/profile',
      {
        schema: {
          summary: 'Get authenticated user profile',
          tags: ['Users'],
          response: {
            200: z.object({
              user: z.object({
                id: z.string(),
                name: z.string().nullable(),
                email: z.string(),
                avatarUrl: z.string().url().nullable(),
              }),
            }),
            404: z.object({
              message: z.string().default('User not found'),
            }),
          },
        },
      },
      async (request, reply) => {
        const userId = await request.getCurrentUserId()
        const result = await getProfileService(userId)
        return reply.status(200).send(result)
      },
    )
}
