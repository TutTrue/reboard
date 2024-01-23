import { Hono } from 'hono'
import { validator } from 'hono/validator'
import { z } from 'zod'
import { prisma } from '../../db'

export const app = new Hono()

app.post('/', validator('json', (value, c) => {

  // TODO add proper schema
  const schema = z.object({
    fullName: z.string(),
    username: z.string(),
    email: z.string(),
    profilePictureURL: z.string()
  })

  const parsed = schema.safeParse(value)

  if (!parsed.success)
    return c.json(parsed.error, 401)

  return parsed.data
}), async (c) => {

  const { fullName, username, email, profilePictureURL } = c.req.valid('json')

  const newUser = await prisma.user.create({
    data: {
      fullName,
      username,
      email,
      profilePictureURL
    },
  })

  return c.json(newUser)
})