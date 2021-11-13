import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'

import sockets from './sockets'
import apolloServer from './graphql'
import auth from './middlewares/auth'


const app = express()

apolloServer.applyMiddleware({ app })

app.use(cors())
app.use(helmet())
app.use(compression())

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(auth)

app.use((req, res, next) => {
    const error = new Error('Page not Found')
    error.statusCode = 404
    next(error)
})

app.use((error, req, res, next) => {
    const status = error.statusCode || 500
    res.status(status).json({ 
        message: error.message, 
        data: error.data,
    })
})

const DB_URI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster1.gvbrv.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
  
mongoose.connect(DB_URI)
.then(() => {
    const server = app.listen(process.env.PORT || 8000)
    sockets.init(server)
})
.catch(err => {
    console.log(err)
})