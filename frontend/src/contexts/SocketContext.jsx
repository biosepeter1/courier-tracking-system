import React, { createContext, useContext, useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import { useAuth } from './AuthContext'

const SocketContext = createContext({
  socket: null,
  isConnected: false,
  joinTrackingRoom: () => {},
  leaveTrackingRoom: () => {},
})

export const useSocket = () => {
  const context = useContext(SocketContext)
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider')
  }
  return context
}

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null)
  const [isConnected, setIsConnected] = useState(false)
  const { token } = useAuth()

  useEffect(() => {
    if (token) {
      const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000'
      
      const newSocket = io(socketUrl, {
        auth: {
          token: token
        },
        transports: ['websocket', 'polling']
      })

      newSocket.on('connect', () => {
        console.log('Socket connected:', newSocket.id)
        setIsConnected(true)
      })

      newSocket.on('disconnect', (reason) => {
        console.log('Socket disconnected:', reason)
        setIsConnected(false)
      })

      newSocket.on('connect_error', (error) => {
        console.error('Socket connection error:', error)
        setIsConnected(false)
      })

      setSocket(newSocket)

      return () => {
        newSocket.close()
      }
    } else {
      // Clean up socket when no token
      if (socket) {
        socket.close()
        setSocket(null)
        setIsConnected(false)
      }
    }
  }, [token])

  const joinTrackingRoom = (trackingNumber) => {
    if (socket && trackingNumber) {
      socket.emit('join-tracking', trackingNumber)
      console.log(`Joined tracking room: ${trackingNumber}`)
    }
  }

  const leaveTrackingRoom = (trackingNumber) => {
    if (socket && trackingNumber) {
      socket.emit('leave-tracking', trackingNumber)
      console.log(`Left tracking room: ${trackingNumber}`)
    }
  }

  const value = {
    socket,
    isConnected,
    joinTrackingRoom,
    leaveTrackingRoom,
  }

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  )
}