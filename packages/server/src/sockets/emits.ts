import { io } from '.'

export function emitNewTask(boardId: string) {
  io.to(boardId).emit('new:task')
}
