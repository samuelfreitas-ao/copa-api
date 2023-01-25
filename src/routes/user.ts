import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'
import { authJWTOnRequest } from '../plugins/authenticate'

export async function userRoutes(fastify: FastifyInstance) {
  fastify.get('/users/count', authJWTOnRequest, async () => {
    const count = await prisma.user.count()
    return { count }
  })
}
