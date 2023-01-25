import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'
import { authJWTOnRequest } from '../plugins/authenticate'

export async function gameRoutes(fastify: FastifyInstance) {
  fastify.get('/games/count', authJWTOnRequest, async () => {
    const count = await prisma.game.count()
    return { count }
  })
}
