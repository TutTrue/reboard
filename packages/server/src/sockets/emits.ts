import { io } from '.'

export function emitListUpdate(boardId: string) {
  io.to(boardId).emit('list-update')
}
