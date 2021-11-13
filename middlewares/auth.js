import { authenticate } from '../graphql/helpers/auth'


const auth = (req, res, next) => {
    authenticate(req)
    next()
}


export default auth