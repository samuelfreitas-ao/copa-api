import { prisma } from '../lib/prisma'

export class UserService {
  async count() {
    const count = await prisma.user.count()
    return { count }
  }

  async index() {
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })
    return { users }
  }
}
