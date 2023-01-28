import { FastifyInstance } from 'fastify'

import { authRoutes } from './auth'
import { gameRoutes } from './games'
import { guessRoutes } from './guess'
import { pollRoutes } from './poll'
import { userRoutes } from './user'

export const routes = async (fastify: FastifyInstance) => {
  await fastify.register(authRoutes)
  await fastify.register(gameRoutes)
  await fastify.register(guessRoutes)
  await fastify.register(pollRoutes)
  await fastify.register(userRoutes)
}
