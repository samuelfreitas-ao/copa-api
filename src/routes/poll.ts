import { FastifyInstance } from 'fastify'
import { authenticate } from '../plugins/authenticate'
import { PollService } from '../services/poll'

const pollService = new PollService()

const authJWTOnRequest = { onRequest: [authenticate] }

export async function pollRoutes(fastify: FastifyInstance) {
  fastify.post('/polls', authJWTOnRequest, pollService.store)
  fastify.get('/polls/count', authJWTOnRequest, pollService.count)
  fastify.post('/polls/:id/join', authJWTOnRequest, pollService.join)
}
