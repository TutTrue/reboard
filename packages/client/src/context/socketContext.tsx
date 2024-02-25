'use client'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { Socket, io } from 'socket.io-client'

const SocketContext = createContext<Socket | null>(null)

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null)

  useEffect(() => {
    const newSocket = io(process.env.SOCKET_SERVER as string)
    setSocket(newSocket)

    return () => {
      newSocket.disconnect()
    }
  }, [])

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  )
}

export const useSocket = () => {
  return useContext(SocketContext)
}
