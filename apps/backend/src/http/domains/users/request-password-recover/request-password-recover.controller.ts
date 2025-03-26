import { z } from 'zod'
import { requestPasswordRecoverService } from './request-password-recover.service'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

export async function requestPasswordRecoverController(fastify: FastifyInstance) {
  fastify.withTypeProvider<ZodTypeProvider>().post(
    '/password/recover',
    {
      schema: {
        tags: ['Users'],
        summary: 'Request password recover',
        response: {
          201: z.null(),
        },
        body: z.object({
          email: z.string().email(),
        }),
      },
    },
    async (request, reply) => {
      await requestPasswordRecoverService(request.body.email)
      return reply.status(201).send()
    },
  )
}
