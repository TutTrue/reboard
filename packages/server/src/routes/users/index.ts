import { Hono } from 'hono'
import { prisma } from '../../db/index'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'

export const app = new Hono()

app.post(
  '/',
  zValidator(
    'json',
    z.object({
      id: z.string().min(1).max(255),
      fullName: z.string().min(1).max(255),
      username: z.string().min(1).max(255),
      email: z.string().email(),
      profilePictureURL: z.string().url(),
    })
  ),
  async (c) => {
    try {
      const { id, fullName, username, email, profilePictureURL } =
        c.req.valid('json')

      const getUser = await prisma.user.findUnique({
        where: {
          id,
        },
      })

      if (getUser) {
        return c.json(
          {
            message: 'User already exists',
          },
          409
        )
      }

      const user = await prisma.user.create({
        data: {
          id,
          fullName,
          username,
          email,
          profilePictureURL,
        },
      })

      return c.json(user, 201)
    } catch (e) {
      return c.json(
        {
          message: 'Internal server error',
        },
        500
      )
    }
  }
)
