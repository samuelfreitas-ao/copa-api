import { FastifyInstance } from 'fastify'
import { authJWTOnRequest } from '../plugins/authenticate'
import { UserService } from '../services/user-service'

const userService = new UserService()

export async function userRoutes(fastify: FastifyInstance) {
  fastify.get('/users', authJWTOnRequest, userService.index)
  fastify.get('/users/count', authJWTOnRequest, userService.count)
}
