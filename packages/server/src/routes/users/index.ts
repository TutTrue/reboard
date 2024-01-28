import { Hono } from 'hono'
import { prisma } from '../../db/index'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'

export const user = new Hono()

user.post(
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
        c.status(409)
        return c.json({
          message: 'User already exists',
        })
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
      c.status(201)
      return c.json(user)
    } catch (e) {
      c.status(500)
      return c.json({
        message: 'Internal server error',
      })
    }
  }
)
