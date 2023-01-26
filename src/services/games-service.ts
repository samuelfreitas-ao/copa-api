import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { prisma } from '../lib/prisma'

export class GameService {
  async store(request: FastifyRequest, reply: FastifyReply) {
    const getGameBody = z.object({
      firstTeamCountryCode: z.string().max(2).min(2),
      secondTeamCountryCode: z.string().max(2).min(2),
    })

    const { firstTeamCountryCode, secondTeamCountryCode } = getGameBody.parse(
      request.body
    )

    await prisma.game.create({
      data: {
        firstTeamCountryCode,
        secondTeamCountryCode,
      },
    })
    return reply.status(201).send({
      message: 'Game created successfully.',
    })
  }

  async index(request: FastifyRequest) {
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
  }
}
