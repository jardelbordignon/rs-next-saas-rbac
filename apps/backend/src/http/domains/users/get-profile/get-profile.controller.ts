import { z } from 'zod'
import { NotFoundError } from '@/http/errors'
import { getProfileService } from './get-profile.service'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

export async function getProfileController(fastify: FastifyInstance) {
  fastify.withTypeProvider<ZodTypeProvider>().get(
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
      try {
        const { sub } = await request.jwtVerify<{ sub: string }>()
        const result = await getProfileService(sub)
        return reply.status(200).send(result)
      } catch (error) {
        const err = error as Error
        if (err instanceof NotFoundError) {
          return reply.status(err.status).send({ message: err.message })
        }
        return reply
          .status(500)
          .send({ message: err.message || 'Internal Server Error' })
      }
    },
  )
}
