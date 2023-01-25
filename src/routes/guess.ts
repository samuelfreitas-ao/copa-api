import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'
import { authJWTOnRequest } from '../plugins/authenticate'

export async function guessRoutes(fastify: FastifyInstance) {
  fastify.get('/guesses/count', authJWTOnRequest, async () => {
    const count = await prisma.guess.count()
    return { count }
  })
}
