import { z } from 'zod'
import { authByGoogleService } from './auth-by-google.service'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

export async function authByGoogleController(fastify: FastifyInstance) {
  fastify.withTypeProvider<ZodTypeProvider>().post(
    '/signin/google',
    {
      schema: {
        tags: ['Users'],
        summary: 'Authenticate user by google',
        response: {
          200: z.object({
            accessToken: z.string(),
          }),
          401: z.object({
            message: z.string().default('Google authentication failed'),
          }),
        },
        body: z.object({
          code: z.string(),
        }),
      },
    },
    async (request, reply) => {
      const result = await authByGoogleService(fastify.jwt, request.body)
      return reply.status(200).send(result)
    },
  )
}
