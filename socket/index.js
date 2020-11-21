const socektIo = require('socket.io')

let io = null
const sockets = {}

export const initSocket = (server) => {
  io = socektIo(server, { cors: { origin: '*' } })

  io.on('connection', (socket) => {
    console.log('New client connected')

    const { userId } = socket.handshake.query
    sockets[userId] = socket

    socket.on('disconnect', () => {
      console.log('Client disconnected')

      const userId = Object.keys(sockets).find(key => socket.id === sockets[key].id)
      delete sockets[userId]
    })
  })
}

export const sendMessage = (type = '', message = {}, userIds = []) => {
  for (const userId of userIds) {
    const socket = sockets[userId]

    if (socket) {
      socket.emit(type, message)
    }
  }
}

export const isUserOnline = (userId) => {
  return !!sockets[userId]
}