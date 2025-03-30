import { z } from 'zod'
import { auth } from '@/http/middlewares'
import { deleteProjectService } from './delete-project.service'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

export async function deleteProjectController(fastify: FastifyInstance) {
  fastify
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .delete(
      '/organizations/:slug/projects/:projectId',
      {
        schema: {
          tags: ['Projects'],
          summary: 'Delete a project of an organization',
          response: {
            204: z.null(),
            401: z.object({
              message: z
                .string()
                .default('You are not allowed to delete this project'),
            }),
          },
          params: z.object({
            slug: z.string(),
            projectId: z.string(),
          }),
        },
      },
      async (request, reply) => {
        const { slug, projectId } = request.params
        const userMembership = await request.getUserMembership(slug)
        await deleteProjectService(projectId, userMembership)
        return reply.status(204).send()
      },
    )
}
