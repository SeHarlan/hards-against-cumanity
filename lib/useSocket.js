import io from 'socket.io-client'
import { useEffect } from 'react'

const socket = io()

export default function useSocket(eventName, callback) {
  useEffect(() => {
    socket.on(eventName, callback)

    return function useSocketCleanup() {
      socket.off(eventName, callback)
    }
  }, [eventName, callback])

  return socket
}