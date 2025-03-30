import { z } from 'zod'
import { insertProjectSchema } from '@/database/schema'
import { auth } from '@/http/middlewares'
import { createProjectService } from './create-project.service'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

export async function createProjectController(fastify: FastifyInstance) {
  fastify
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/organizations/:slug/projects',
      {
        schema: {
          summary: 'Create project',
          tags: ['Projects'],
          response: {
            201: z.object({
              projectId: z.string(),
            }),
            409: z.object({
              message: z
                .string()
                .default('Project with email johndoe@email.com already exists'),
            }),
          },
          params: z.object({
            slug: z.string(),
          }),
          body: insertProjectSchema.omit({ slug: true }),
        },
      },
      async (request, reply) => {
        const { slug } = request.params
        const userMembership = await request.getUserMembership(slug)
        await createProjectService(userMembership, request.body)
        return reply.status(201).send()
      },
    )
}
