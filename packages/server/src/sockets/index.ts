import { Server } from 'socket.io'

export const io = new Server({ cors: { origin: 'http://localhost:3000' } })

io.on('connection', (socket) => {
  console.log('A user connected: ', socket.id)

  socket.on('join', (boardId: string) => {
    socket.join(boardId)
  })

  socket.on('disconnect', () => {
    console.log('A user disconnected')
  })
})
