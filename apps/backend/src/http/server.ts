/* eslint-disable no-console */
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import { fastify } from 'fastify'
import {
  type ZodTypeProvider,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'
import { env } from '@/env'
import { registerSwagger } from '../infra/swagger'
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
registerSwagger(app, routePrefix)

routes(app)

app
  .listen({
    host: '0.0.0.0',
    port: env.PORT,
  })
  .then(() => {
    const address = app.server.address()
    if (address && typeof address === 'object') {
      const url = `http://${address.address}:${address.port}`
      const message =
        env.NODE_ENV !== 'production' ? `doc: ${url}${routePrefix}` : url
      console.info(`HTTP Server Running! ${message}`)
    } else {
      console.info(`HTTP Server Running! Address: ${address}`)
    }
  })
