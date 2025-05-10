import swagger from '@fastify/swagger'
import swaggerUI from '@fastify/swagger-ui'
import { jsonSchemaTransform } from 'fastify-type-provider-zod'
import { SwaggerTheme, SwaggerThemeNameEnum } from 'swagger-themes'
import { env } from '@/env'
import type { FastifyInstance } from 'fastify'

export function registerSwagger(app: FastifyInstance, routePrefix: string) {
  if (env.NODE_ENV !== 'production') {
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
      uiConfig: {
        onComplete: () => {
          const TOKEN_NAME = 'swaggerAuthToken'

          const token = localStorage.getItem(TOKEN_NAME)

          const observer = new MutationObserver(() => {
            const input = document.querySelector(
              '#auth-bearer-value',
            ) as HTMLInputElement

            if (input && token) {
              input.value = token
            }
          })

          observer.observe(document.body, { childList: true, subtree: true })

          document.body.addEventListener('click', event => {
            const target = event.target as HTMLElement
            if (target && target.classList.contains('authorize')) {
              const input = document.querySelector(
                '#auth-bearer-value',
              ) as HTMLInputElement

              if (input) {
                input.addEventListener('input', () => {
                  const newToken = input.value
                  if (newToken) {
                    localStorage.setItem(TOKEN_NAME, newToken)
                  }
                })
              }
            }
          })
        },
      },
    })
  }
}
