import { FastifyRequest } from 'fastify'

async function authenticate(request: FastifyRequest) {
  await request.jwtVerify()
}

export const authJWTOnRequest = { onRequest: [authenticate] }
