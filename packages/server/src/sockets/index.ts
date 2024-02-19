import { Server } from 'socket.io'

export const io = new Server({ cors: { origin: 'http://localhost:3000' } })

io.on('connection', (socket) => {
  console.log('A user connected: ', socket.id)

  socket.on('event', (payload) => {
    console.log('Hello world')
    io.sockets.emit('event', { data: payload })
  })

  socket.on('join', (room) => {
    socket.join(room)
  })

  socket.on('disconnect', () => {
    console.log('A user disconnected')
  })
})
