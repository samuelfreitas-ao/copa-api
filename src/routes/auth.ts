import { FastifyInstance } from 'fastify'
import { authJWTOnRequest } from '../plugins/authenticate'
import { AuthService } from '../services/auth-service'

const authService = new AuthService()

export async function authRoutes(fastify: FastifyInstance) {
  fastify.post('/login', async (request, reply) =>
    authService.login(request, reply, fastify)
  )
  fastify.get('/me', authJWTOnRequest, authService.me)

  fastify.post('/logout', authJWTOnRequest, authService.logout)
}
