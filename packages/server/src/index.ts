import { serve } from '@hono/node-server'
import { Hono } from 'hono'

import { app as routes } from './routes'

const app = new Hono()
const PORT = (process.env.PORT || 3000) as number

app.route('/api', routes)

console.log(`Server is running on port ${PORT}`)
serve({
  fetch: app.fetch,
  port: PORT,
})
