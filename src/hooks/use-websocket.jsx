"use client"

import { useState, useEffect, useCallback } from "react"
import { getCookie } from "cookies-next"

export function useWebSocket() {
  const [socket, setSocket] = useState(null)
  const [isConnected, setIsConnected] = useState(false)
  const [lastMessage, setLastMessage] = useState(null)
  const [reconnectAttempt, setReconnectAttempt] = useState(0)

  const connect = useCallback(() => {
    const token = getCookie("token")
    if (!token) return

    // In a real implementation, use a secure WebSocket connection
    // const ws = new WebSocket(`wss://your-api-domain.com/ws?token=${token}`)

    // For development/demo purposes, we'll simulate WebSocket behavior
    const mockSocket = {
      send: (message) => {
        console.log("WebSocket message sent:", message)
      },
      close: () => {
        console.log("WebSocket connection closed")
        setIsConnected(false)
      },
    }

    // Simulate connection established
    setTimeout(() => {
      setIsConnected(true)
      setSocket(mockSocket)
      console.log("WebSocket connection established")
    }, 500)

    // Simulate receiving messages periodically (for demo purposes)
    const interval = setInterval(() => {
      // Only simulate messages occasionally
      if (Math.random() > 0.9) {
        const mockNotification = {
          type: "notification",
          notification: {
            _id: Date.now().toString(),
            type: ["task-assigned", "task-updated", "task-completed"][Math.floor(Math.random() * 3)],
            title: "New Notification",
            message: "You have a new task notification",
            read: false,
            data: { taskId: Math.floor(Math.random() * 1000).toString() },
            createdAt: new Date().toISOString(),
          },
        }

        setLastMessage({ data: JSON.stringify(mockNotification) })
      }
    }, 30000) // Every 30 seconds

    return () => {
      clearInterval(interval)
      mockSocket.close()
    }
  }, [reconnectAttempt])

  useEffect(() => {
    const cleanup = connect()

    return () => {
      if (cleanup) cleanup()
    }
  }, [connect])

  const reconnect = useCallback(() => {
    if (socket) {
      socket.close()
    }
    setReconnectAttempt((prev) => prev + 1)
  }, [socket])

  return {
    socket,
    isConnected,
    lastMessage,
    reconnect,
  }
}

