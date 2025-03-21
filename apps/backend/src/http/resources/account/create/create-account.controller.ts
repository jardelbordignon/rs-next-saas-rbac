import { z } from 'zod'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

export async function createAccountController(fastify: FastifyInstance) {
  fastify.withTypeProvider<ZodTypeProvider>().post(
    '/account',
    {
      schema: {
        body: z.object({
          name: z.string(),
          email: z.string().email(),
          password: z.string().min(6),
        }),
      },
    },
    async () => {
      return 'User created successfully'
    },
  )
}
