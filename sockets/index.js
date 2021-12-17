import { Server } from 'socket.io'

import { authFunctions } from './auth'
import { chatFunctions } from './chat'
import { messageFunctions } from './message'


let io

const sockets =  {
    init: httpServer => {
        io = new Server(httpServer, {
            cors: {
                credentials: true,
                origin: (
                    process.env.PRODUCTION ? 
                    "https://localhost:3000" :
                    "https://next-some.vercel.app/"
                ),
                methods: ["GET", "POST"],
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