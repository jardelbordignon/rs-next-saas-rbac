/* eslint-disable no-console */
import cors from '@fastify/cors'
import { fastify } from 'fastify'
import {
  // jsonSchemaTransform,
  type ZodTypeProvider,
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

routes(app)

app.get('/', async () => {
  return { hello: 'world' }
})

app
  .listen({
    host: '0.0.0.0',
    port: env.PORT,
  })
  .then(() => {
    const address = app.server.address()
    if (address && typeof address === 'object') {
      const url = `http://${address.address}:${address.port}`

      console.info(`HTTP Server Running: ${url}`)
    } else {
      console.info(`HTTP Server Running! Address: ${address}`)
    }
  })

//
