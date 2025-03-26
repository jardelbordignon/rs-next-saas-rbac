import { z } from 'zod'
import { authByFacebookService } from './auth-by-facebook.service'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

export async function authByFacebookController(fastify: FastifyInstance) {
  fastify.withTypeProvider<ZodTypeProvider>().post(
    '/signin/facebook',
    {
      schema: {
        tags: ['Users'],
        summary: 'Authenticate user by facebook',
        response: {
          200: z.object({
            accessToken: z.string(),
          }),
          401: z.object({
            message: z.string().default('Facebook authentication failed'),
          }),
        },
        body: z.object({
          code: z.string(),
        }),
      },
    },
    async (request, reply) => {
      const result = await authByFacebookService(fastify.jwt, request.body)
      return reply.status(200).send(result)
    },
  )
}
