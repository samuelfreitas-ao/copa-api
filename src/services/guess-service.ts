import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { prisma } from '../lib/prisma'

export class GuessService {
  async count() {
    const count = await prisma.guess.count()
    return { count }
  }

  async create(request: FastifyRequest, reply: FastifyReply) {
    const createGuessParams = z.object({
      pollId: z.string(),
      gameId: z.string(),
    })

    const createGuessBody = z.object({
      firstTeamPoints: z.number(),
      secondTeamPoints: z.number(),
    })

    const { gameId, pollId } = createGuessParams.parse(request.params)
    const { firstTeamPoints, secondTeamPoints } = createGuessBody.parse(
      request.body
    )

    const participant = await prisma.participant.findUnique({
      where: {
        userId_pollId: {
          userId: request.user.sub,
          pollId,
        },
      },
    })

    if (!participant) {
      return reply.status(400).send({
        message: "You're not allowed to create a guess inside this poll.",
      })
    }

    const guess = await prisma.guess.findUnique({
      where: {
        participantId_gameId: {
          participantId: participant.id,
          gameId,
        },
      },
    })

    if (guess) {
      return reply.status(400).send({
        message: 'You already sent a guess to this game on this poll.',
      })
    }

    const game = await prisma.game.findUnique({
      where: {
        id: gameId,
      },
    })

    if (!game) {
      return reply.status(400).send({
        message: 'Game not found.',
      })
    }

    if (game.date < new Date()) {
      return reply.status(400).send({
        message: 'You can not send gesses after the game date.',
      })
    }

    await prisma.guess.create({
      data: {
        gameId,
        participantId: participant.id,
        firstTeamPoints,
        secondTeamPoints,
      },
    })

    return reply.status(201).send({
      message: 'Guess created successfully.',
    })
  }
}
