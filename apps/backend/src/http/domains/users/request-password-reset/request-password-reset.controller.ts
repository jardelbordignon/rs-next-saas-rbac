import { z } from 'zod'
import { requestPasswordResetService } from './request-password-reset.service'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

export async function requestPasswordResetController(fastify: FastifyInstance) {
  fastify.withTypeProvider<ZodTypeProvider>().post(
    '/password/reset',
    {
      schema: {
        tags: ['Users'],
        summary: 'Request password reset',
        response: {
          204: z.null(),
        },
        body: z.object({
          code: z.string(),
          password: z.string().min(6),
        }),
      },
    },
    async (request, reply) => {
      await requestPasswordResetService(request.body)
      return reply.status(204).send()
    },
  )
}
