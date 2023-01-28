import Fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'

import { routes } from './routes'
import { TokenUtils } from './utils/token-utils'

TokenUtils.init()
;(async () => {
  const fastify = Fastify({ logger: true })

  await fastify.register(cors, { origin: true })

  const secret = process.env.JWT_SECRET as string
  await fastify.register(jwt, { secret })

  await fastify.register(routes)

  await fastify.listen({ port: 3333, host: '0.0.0.0' })
})()
