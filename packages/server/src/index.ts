import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { jwt } from 'hono/jwt'

import { app as routes } from './routes'

const app = new Hono()
const PORT = (process.env.PORT || 3001) as number

app.use('/api', jwt({ secret: '123', cookie: 'token', alg: "HS256" }))

app.route('/api', routes)

console.log(`Server is running on port ${PORT}`)
serve({
  fetch: app.fetch,
  port: PORT,
})
