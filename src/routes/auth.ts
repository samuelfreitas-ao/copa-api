import { FastifyInstance } from 'fastify'
import { authJWTOnRequest } from '../plugins/authenticate'
import { AuthService } from '../services/auth-service'

const authService = new AuthService()

export async function authRoutes(fastify: FastifyInstance) {
  fastify.get('/me', authJWTOnRequest, authService.me)
  fastify.post('/users', async (request, reply) =>
    authService.login(request, reply, fastify)
  )
}
