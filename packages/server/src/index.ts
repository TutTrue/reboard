import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { cors } from 'hono/cors'

import { app as routes } from './routes'

const app = new Hono()
const PORT = (process.env.PORT || 3001) as number


app.use('*', logger())
app.use('*', cors())
app.route('/api', routes)

console.log(`Server is running on port ${PORT}`)
serve({
  fetch: app.fetch,
  port: PORT,
})
