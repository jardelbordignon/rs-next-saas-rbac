/* eslint-disable no-console */
import cors from '@fastify/cors'
import swagger, { type FastifyDynamicSwaggerOptions } from '@fastify/swagger'
import swaggerUI from '@fastify/swagger-ui'
import { fastify } from 'fastify'
import {
  type ZodTypeProvider,
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'
import { env } from '@/env'
import { routes } from './domains/routes'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(cors, {
  origin: true,
})

const routePrefix = '/docs'
const isNotProd = env.NODE_ENV !== 'production'

if (isNotProd) {
  const swaggerOptions: FastifyDynamicSwaggerOptions = {
    openapi: {
      info: {
        title: 'SaaS API',
        description: 'Fullstack multi-tenant SaaS application with RBAC',
        version: '1.0.0',
      },
      components: {
        securitySchemes:
          env.NODE_ENV === 'development'
            ? {
                bearerAuth: {
                  type: 'http',
                  scheme: 'bearer',
                  bearerFormat: 'JWT',
                },
              }
            : undefined,
      },
    },
    transform: jsonSchemaTransform,
  }

  app.register(swagger, swaggerOptions)
  app.register(swaggerUI, { routePrefix })
}

routes(app)

app.get('/', async () => {
  return { hello: 'world' }
})

app
  .listen({
    host: '127.0.0.1',
    port: env.PORT,
  })
  .then(() => {
    const address = app.server.address()
    if (address && typeof address === 'object') {
      const url = `http://${address.address}:${address.port}`
      const message = isNotProd ? `doc: ${url}${routePrefix}` : url
      console.info(`HTTP Server Running! ${message}`)
    } else {
      console.info(`HTTP Server Running! Address: ${address}`)
    }
  })
