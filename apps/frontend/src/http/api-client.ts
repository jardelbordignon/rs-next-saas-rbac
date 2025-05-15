import { getCookie } from 'cookies-next'
import ky from 'ky'

export const api = ky.create({
  prefixUrl: process.env.API_URL,
  hooks: {
    beforeRequest: [
      async request => {
        const isServerSide = typeof window === 'undefined'
        let accessToken: string | undefined

        if (isServerSide) {
          const { cookies } = await import('next/headers')
          accessToken = await getCookie('accessToken', { cookies })
        } else {
          accessToken = await getCookie('accessToken')
        }

        if (accessToken) {
          request.headers.set('Authorization', `Bearer ${accessToken}`)
        }
      },
    ],
  },
})
