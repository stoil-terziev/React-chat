import dotenv from 'dotenv'
import logger from 'morgan'
import http from 'http'
import session from 'express-session'
import cors from 'cors'
import store, { MongoStoreFactory } from 'connect-mongo'
import favicon from 'serve-favicon'
import express, { Application } from 'express'
import redis, { RedisClient } from 'redis'
import passport from 'passport'
import Router from './Router'
import Database from './Database'
import ErrorHandler from './ErrorHandler'
import Socket from './Socket'
import Authorization from './Authorization'

dotenv.config()
const port: number = parseInt(process.env.PORT as string) || 3000
const app: Application = express()
const server: http.Server = http.createServer(app)
const cache: RedisClient = redis.createClient()
const db: Database = new Database(cache)
const MongoStore: MongoStoreFactory = store(session)

app.use(logger('dev'))
app.use(favicon('./favicon.ico'))
app.use(express.json())
app.use(
  session({
    store: new MongoStore({
      url: process.env.DB as string,
      touchAfter: 24 * 3600,
      mongoOptions: {
        useUnifiedTopology: true
      }
    }),
    secret: 'Vyatarko',
    resave: true,
    saveUninitialized: true,
    cookie: {
      secure: false,
      maxAge: 2 * 24 * 60 * 60 * 1000
    }
  })
)
app.use(passport.initialize())
app.use(passport.session())
app.use(cors({
  credentials: true,
  origin: true,
  maxAge: 2 * 24 * 60 * 60 * 1000
}))

new Authorization(db)
new Socket(server, db)
new Router(app, db, cache)

server.on('error', ErrorHandler(port))

server.listen(port, (): void => {
  console.log(`Listening on ${port}`)
})
