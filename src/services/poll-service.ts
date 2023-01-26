import { FastifyReply, FastifyRequest } from 'fastify'
import ShortUniqueId from 'short-unique-id'
import { z } from 'zod'
import { prisma } from '../lib/prisma'

export class PollService {
  async store(request: FastifyRequest, reply: FastifyReply) {
    const createPollBody = z.object({
      title: z.string(),
    })

    const { title } = createPollBody.parse(request.body)
    const generate = new ShortUniqueId({ length: 6 })
    const code = String(generate()).toUpperCase()

    try {
      await request.jwtVerify()

      let userId = request.user.sub
      await prisma.poll.create({
        data: {
          title,
          code,
          ownerId: userId,
          participants: {
            create: {
              userId,
            },
          },
        },
      })
    } catch (error) {
      await prisma.poll.create({
        data: {
          title,
          code,
        },
      })
    }
    return reply.status(201).send({ code })
  }

  async listParticipatingPolls(request: FastifyRequest) {
    const polls = await prisma.poll.findMany({
      where: {
        participants: {
          some: {
            userId: request.user.sub,
          },
        },
      },
      include: {
        _count: {
          select: {
            participants: true,
          },
        },
        participants: {
          select: {
            id: true,
            user: {
              select: {
                avatarUrl: true,
              },
            },
          },
          take: 4,
        },
        owner: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })
    return { polls }
  }

  async show(request: FastifyRequest) {
    const getPollParams = z.object({
      id: z.string(),
    })

    const { id } = getPollParams.parse(request.params)

    const poll = await prisma.poll.findUnique({
      where: {
        id,
      },
      include: {
        _count: {
          select: {
            participants: true,
          },
        },
        participants: {
          select: {
            id: true,
            user: {
              select: {
                avatarUrl: true,
              },
            },
          },
          take: 4,
        },
        owner: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })
    return { poll }
  }

  async join(request: FastifyRequest, response: FastifyReply) {
    const joinPollBody = z.object({
      code: z.string(),
    })

    const { code } = joinPollBody.parse(request.body)

    const userId = request.user.sub

    const poll = await prisma.poll.findUnique({
      where: { code },
      include: {
        participants: {
          where: {
            userId,
          },
        },
      },
    })

    if (!poll) {
      return response.status(400).send({
        message: 'Poll not found.',
      })
    }

    if (poll.participants.length > 0) {
      return response.status(400).send({
        message: 'You alread joined this poll.',
      })
    }

    if (!poll.ownerId) {
      await prisma.poll.update({
        data: {
          ownerId: userId,
        },
        where: {
          id: poll.id,
        },
      })
    }

    await prisma.participant.create({
      data: {
        pollId: poll.id,
        userId,
      },
    })

    return response.status(201).send({})
  }

  async count() {
    const count = await prisma.poll.count()
    return { count }
  }
}
