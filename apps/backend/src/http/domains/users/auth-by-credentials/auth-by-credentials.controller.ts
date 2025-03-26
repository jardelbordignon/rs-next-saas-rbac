import { z } from 'zod'
import { BadRequestError, UnauthorizedError } from '@/http/errors'
import { authByCredentialsService } from './auth-by-credentials.service'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

export async function authByCredentialsController(fastify: FastifyInstance) {
  fastify.withTypeProvider<ZodTypeProvider>().post(
    '/signin',
    {
      schema: {
        summary: 'Authenticate user by credentials',
        tags: ['Users'],
        response: {
          200: z.object({
            accessToken: z.string(),
          }),
          400: z.object({
            message: z
              .string()
              .default('User does not have a password, use social login'),
          }),
          401: z.object({
            message: z.string().default('Invalid credentials'),
          }),
        },
        body: z.object({
          email: z.string().email(),
          password: z.string().min(6),
        }),
      },
    },
    async (request, reply) => {
      try {
        const result = await authByCredentialsService(fastify.jwt, request.body)
        return reply.status(200).send(result)
      } catch (error) {
        const err = error as Error
        if (err instanceof UnauthorizedError || err instanceof BadRequestError) {
          return reply.status(err.status).send({ message: err.message })
        }
        return reply
          .status(500)
          .send({ message: err.message || 'Internal Server Error' })
      }
    },
  )
}
