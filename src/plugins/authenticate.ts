import { FastifyReply, FastifyRequest } from 'fastify'

async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  const tokenlist = (global as any).tokenList as string[]
  const token = request.headers.authorization?.split(' ')[1]
  if (tokenlist.find((item) => item == token)) {
    reply.status(400).send({
      message: 'Invalid token',
    })
  }
  await request.jwtVerify()
}

export const authJWTOnRequest = { onRequest: [authenticate] }
