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
          summary: 'Create a project of an organization',
          tags: ['Projects'],
          response: {
            201: z.object({
              projectId: z.string(),
            }),
            401: z.object({
              message: z
                .string()
                .default('You are not allowed to create new projects'),
            }),
          },
          params: z.object({
            slug: z.string(),
          }),
          body: insertProjectSchema
            .pick({ name: true, description: true, avatarUrl: true, isPrivate: true })
            .extend({
              slug: z.string().optional(),
            }),
        },
      },
      async (request, reply) => {
        const { slug } = request.params
        const userMembership = await request.getUserMembership(slug)
        const result = await createProjectService(userMembership, request.body)
        return reply.status(201).send(result)
      },
    )
}
