import { z } from 'zod'
import { createUserService } from './create-user.service'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

export async function createUserController(fastify: FastifyInstance) {
  fastify.withTypeProvider<ZodTypeProvider>().post(
    '/signup',
    {
      schema: {
        summary: 'Create user',
        tags: ['Users'],
        response: {
          201: z.object({}),
          409: z.object({
            message: z
              .string()
              .default('User with email johndoe@email.com already exists'),
          }),
        },
        body: z.object({
          name: z.string(),
          email: z.string().email(),
          password: z.string().min(6),
          avatar_url: z.string().url().optional(),
        }),
      },
    },
    async (request, reply) => {
      const { email, name, avatar_url: avatarUrl, password } = request.body
      await createUserService({ email, name, avatarUrl, password })
      return reply.status(201).send()
    },
  )
}
