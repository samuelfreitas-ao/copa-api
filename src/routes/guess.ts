import { FastifyInstance } from 'fastify'
import { authJWTOnRequest } from '../plugins/authenticate'
import { GuessService } from '../services/guess-service'

const guessService = new GuessService()

export async function guessRoutes(fastify: FastifyInstance) {
  fastify.get('/guesses/count', authJWTOnRequest, guessService.count)
  fastify.post(
    '/polls/:pollId/games/:gameId/guesses',
    authJWTOnRequest,
    guessService.create
  )
}
