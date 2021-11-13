import lodash from 'lodash'
import { ApolloServer } from 'apollo-server-express'

import authTypeDefs from './typeDefs/auth'
import authResolvers from './resolvers/auth'


const apolloServer = new ApolloServer({ 
    typeDefs: [ authTypeDefs ],
    resolvers: lodash.merge(authResolvers),
    context: ({ req }) => ({
        req,
    }),
    formatError(err) {
        console.log(err)
        return {
            message: err.message
        }
    },
})

await apolloServer.start()


export default apolloServer