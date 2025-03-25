import { z } from 'zod'
import { ConflictError } from '@/http/errors'
import { createUserService } from './create-user.service'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

export async function createUserController(fastify: FastifyInstance) {
  fastify.withTypeProvider<ZodTypeProvider>().post(
    '/signup',
    {
      schema: {
        body: z.object({
          name: z.string(),
          email: z.string().email(),
          password: z.string().min(6),
          avatarUrl: z.string().url().optional(),
        }),
      },
    },
    async (request, reply) => {
      try {
        await createUserService(request.body)
        return reply.status(201).send()
      } catch (error) {
        const err = error as Error
        if (err instanceof ConflictError) {
          return reply.status(err.status).send(err.message)
        }
        return reply.status(500).send(err.message ?? 'Internal Server Error')
      }
    },
  )
}
