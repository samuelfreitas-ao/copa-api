import { FastifyInstance } from 'fastify'
import ShortUniqueId from 'short-unique-id'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { authenticate } from '../plugins/authenticate'

export async function pollRoutes(fastify: FastifyInstance) {
  fastify.get('/polls/count', async () => {
    const count = await prisma.poll.count()
    return { count }
  })

  fastify.post('/polls', async (request, reply) => {
    const createPoolBody = z.object({
      title: z.string(),
    })

    const { title } = createPoolBody.parse(request.body)
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
  })

  fastify.post(
    '/polls/:id/join',
    { onRequest: [authenticate] },
    async (request, response) => {
      const joinPoolBody = z.object({
        code: z.string(),
      })

      const { code } = joinPoolBody.parse(request.body)

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
          message: 'Poll not found',
        })
      }

      if (poll.participants.length > 0) {
        return response.status(400).send({
          message: 'You alread joined this poll',
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
  )
}
