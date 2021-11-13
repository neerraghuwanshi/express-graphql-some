import User from '../models/user'


export const authFunctions = (socket) => {
    socket.on('join', async (data) => {
        const user = await User.findOne(
            { token: data.token },
            '_id',
        )
        if (user) {
            const userId = user._id.toString()
            if (!socket.rooms.has(userId)) {
                socket.join(userId)
            }
        }
    })
}