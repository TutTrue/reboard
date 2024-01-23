import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import dotenv from 'dotenv'
import cors from 'cors'

dotenv.config()
const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: true,
    credentials: true,
  },
  allowEIO3: true,
})
const PORT = process.env.PORT || 3002
app.use(cors())
io.on('connection', (socket) => {
  console.log('A user connected: ', socket.id)
  socket.on('disconnect', () => {
    console.log('A user disconnected')
  })
})

server.listen(PORT, () => {
  console.log(`Socket.IO server listening on *:${PORT}`)
})
