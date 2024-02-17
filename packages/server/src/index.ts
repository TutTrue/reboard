import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { cors } from 'hono/cors'

import { app as routes } from './routes'
import { io } from './sockets'

const app = new Hono()
const PORT = (process.env.PORT || 3001) as number
const SOCKET_PORT = (process.env.SOCKET_PORT || 3002) as number

app.use('*', logger())
app.use('*', cors())
app.route('/api', routes)

console.log(`Server is running on port ${PORT}`)
console.log(`Socket.io is running on port ${SOCKET_PORT}`)
io.listen(SOCKET_PORT)
serve({
  fetch: app.fetch,
  port: PORT,
})
