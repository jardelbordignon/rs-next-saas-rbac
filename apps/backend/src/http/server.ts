import cors from '@fastify/cors'
import { fastify } from 'fastify'
import {
  // jsonSchemaTransform,
  type ZodTypeProvider,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'
import { routes } from './resources/routes'

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
    port: 4000,
  })
  .then(() => {
    console.log('HTTP Server Running!')
  })

//
