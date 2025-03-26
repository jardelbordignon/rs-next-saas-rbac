import { z } from 'zod'
import { authByGithubService } from './auth-by-github.service'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

export async function authByGithubController(fastify: FastifyInstance) {
  fastify.withTypeProvider<ZodTypeProvider>().post(
    '/signin/github',
    {
      schema: {
        summary: 'Authenticate user by github',
        tags: ['Users'],
        response: {
          200: z.object({
            accessToken: z.string(),
          }),
          401: z.object({
            message: z.string().default('Github authentication failed'),
          }),
        },
        body: z.object({
          code: z.string(),
        }),
      },
    },
    async (request, reply) => {
      const result = await authByGithubService(fastify.jwt, request.body)
      return reply.status(200).send(result)
    },
  )
}
