import { z } from 'zod'
import { selectProjectSchema, selectUserSchema } from '@/database/schema'
import { auth } from '@/http/middlewares'
import { findManyProjectService } from './find-many-project.service'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

export async function findManyProjectController(fastify: FastifyInstance) {
  fastify
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations/:slug/projects',
      {
        schema: {
          tags: ['Projects'],
          summary: 'Find projects of an organization',
          response: {
            200: z.array(
              z.object({
                project: selectProjectSchema.omit({
                  ownerId: true,
                  organizationId: true,
                }),
                owner: selectUserSchema.omit({
                  passwordHash: true,
                  createdAt: true,
                  updatedAt: true,
                }),
              }),
            ),
            401: z.object({
              message: z.string().default('You are not allowed to see this project'),
            }),
            404: z.object({
              message: z
                .string()
                .default('There are no projects in this organization'),
            }),
          },
          params: z.object({
            slug: z.string(),
          }),
        },
      },
      async (request, reply) => {
        const { slug } = request.params
        const userMembership = await request.getUserMembership(slug)
        const result = await findManyProjectService(userMembership)
        return reply.status(200).send(result)
      },
    )
}
