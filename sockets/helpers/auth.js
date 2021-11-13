import User from '../../models/user'


export const authenticate = async (data, fields) => {
    const user = await User.findOne(
        { token: data.token },
        fields ? fields : '_id',
    )
    return user
}