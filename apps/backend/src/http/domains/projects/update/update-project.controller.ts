import { z } from 'zod'
import { updateProjectSchema } from '@/database/schema'
import { auth } from '@/http/middlewares'
import { updateProjectService } from './update-project.service'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

export async function updateProjectController(fastify: FastifyInstance) {
  fastify
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .put(
      '/organizations/:slug/projects/:projectId',
      {
        schema: {
          summary: 'Update a project of an organization',
          tags: ['Projects'],
          response: {
            204: z.null(),
            401: z.object({
              message: z
                .string()
                .default('You are not allowed to update new projects'),
            }),
            404: z.object({
              message: z.string().default('Project not found'),
            }),
          },
          params: z.object({
            slug: z.string(),
            projectId: z.string(),
          }),
          body: updateProjectSchema.pick({
            name: true,
            slug: true,
            description: true,
            avatarUrl: true,
            isPrivate: true,
          }),
        },
      },
      async (request, reply) => {
        const { slug, projectId } = request.params
        const userMembership = await request.getUserMembership(slug)
        await updateProjectService(projectId, userMembership, request.body)
        return reply.status(204).send()
      },
    )
}
