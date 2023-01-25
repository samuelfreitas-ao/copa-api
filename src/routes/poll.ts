import { FastifyInstance } from 'fastify'
import { authJWTOnRequest } from '../plugins/authenticate'
import { PollService } from '../services/poll'

const pollService = new PollService()

export async function pollRoutes(fastify: FastifyInstance) {
  fastify.post('/polls', authJWTOnRequest, pollService.store)
  fastify.get('/polls', authJWTOnRequest, pollService.listParticipatingPolls)
  fastify.get('/polls/count', authJWTOnRequest, pollService.count)
  fastify.post('/polls/:id/join', authJWTOnRequest, pollService.join)
}
