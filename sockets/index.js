import { Server } from 'socket.io'

import { authFunctions } from './auth'
import { chatFunctions } from './chat'
import { messageFunctions } from './message'


let io

const sockets =  {
    init: httpServer => {
        io = new Server(httpServer, {
            cors: {
                origin: "https://localhost:3000",
                methods: ["GET", "POST"],
                credentials: true,
            }
        })
        io.sockets.on('connection', (socket) => {
            authFunctions(socket)
            chatFunctions(socket, io)
            messageFunctions(socket, io)
        })
        return io
    },
    getIO: () => {
        if (!io) {
            throw new Error('Socket.io not initialized!')
        }
        return io
    },
}


export default sockets