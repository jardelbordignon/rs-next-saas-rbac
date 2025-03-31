import { z } from 'zod'
import { selectProjectSchema, selectUserSchema } from '@/database/schema'
import { auth } from '@/http/middlewares'
import { findOneProjectService } from './find-one-project.service'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

export async function findOneProjectController(fastify: FastifyInstance) {
  fastify
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations/:orgSlug/projects/:projectSlug',
      {
        schema: {
          tags: ['Projects'],
          summary: 'Find a project of an organization',
          response: {
            200: z.object({
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
            401: z.object({
              message: z.string().default('You are not allowed to see this project'),
            }),
            404: z.object({
              message: z.string().default('Project not found'),
            }),
          },
          params: z.object({
            orgSlug: z.string(),
            projectSlug: z.string(),
          }),
        },
      },
      async (request, reply) => {
        const { orgSlug, projectSlug } = request.params
        const userMembership = await request.getUserMembership(orgSlug)
        const result = await findOneProjectService(projectSlug, userMembership)
        return reply.status(200).send(result)
      },
    )
}
