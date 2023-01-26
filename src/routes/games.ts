import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { authJWTOnRequest } from '../plugins/authenticate'

export async function gameRoutes(fastify: FastifyInstance) {
  fastify.get('/polls/:pollId/games', authJWTOnRequest, async (request) => {
    const getPollParams = z.object({
      pollId: z.string(),
    })

    const { pollId } = getPollParams.parse(request.params)
    const games = await prisma.game.findMany({
      orderBy: {
        date: 'desc',
      },
      include: {
        guesses: {
          where: {
            participant: {
              userId: request.user.sub,
              pollId,
            },
          },
        },
      },
    })
    return {
      games: games.map((game) => {
        return {
          ...game,
          guess: game.guesses.length > 0 ? game.guesses[0] : null,
          guesses: undefined,
        }
      }),
    }
  })
}
