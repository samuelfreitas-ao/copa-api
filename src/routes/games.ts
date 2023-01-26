import { FastifyInstance } from 'fastify'
import { authJWTOnRequest } from '../plugins/authenticate'
import { GameService } from '../services/games-service'

const gameService = new GameService()

export async function gameRoutes(fastify: FastifyInstance) {
  fastify.post('/games', authJWTOnRequest, gameService.store)
  fastify.get('/polls/:pollId/games', authJWTOnRequest, gameService.index)
}
