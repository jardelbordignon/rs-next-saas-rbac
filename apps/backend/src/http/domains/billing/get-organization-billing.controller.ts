import { z } from 'zod'
import { auth } from '@/http/middlewares'
import { getOrganizationBillingService } from './get-organization-billing.service'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

export async function getOrganizationBillingController(fastify: FastifyInstance) {
  fastify
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations/:slug/billing',
      {
        schema: {
          tags: ['Billing'],
          summary: 'Get billing information from an organization',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          response: {
            200: z.object({
              billing: z.object({
                seats: z.object({
                  amount: z.number(),
                  price: z.number(),
                  unit: z.number(),
                }),
                projects: z.object({
                  amount: z.number(),
                  price: z.number(),
                  unit: z.number(),
                }),
                total: z.number(),
              }),
            }),
          },
        },
      },
      async (request, reply) => {
        const { slug } = request.params
        const userMembership = await request.getUserMembership(slug)
        const result = await getOrganizationBillingService(userMembership)
        return reply.status(200).send(result)
      },
    )
}
