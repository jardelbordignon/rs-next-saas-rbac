/* eslint-disable no-console */
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import swagger from '@fastify/swagger'
import swaggerUI from '@fastify/swagger-ui'
import { fastify } from 'fastify'
import {
  type ZodTypeProvider,
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'
import { SwaggerTheme, SwaggerThemeNameEnum } from 'swagger-themes'
import { env } from '@/env'
import { routes } from './domains/routes'
import { errorsHandler } from './errors-handler'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(cors, {
  origin: true,
})

app.register(jwt, {
  secret: env.JWT_SECRET,
  sign: { expiresIn: env.JWT_EXPIRES_IN },
})

app.setErrorHandler(errorsHandler)

const routePrefix = '/docs'
const isNotProd = env.NODE_ENV !== 'production'

if (isNotProd) {
  app.register(swagger, {
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
  })

  const content = new SwaggerTheme().getBuffer(SwaggerThemeNameEnum.DARK)

  app.register(swaggerUI, {
    routePrefix,
    theme: { css: [{ filename: 'theme.css', content }] },
  })
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
