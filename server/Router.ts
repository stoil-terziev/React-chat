import { Application, Request, Response, NextFunction } from 'express'
import passport from 'passport'
import bcrypt from 'bcrypt'
import Database from 'Database'
import { User, SignResponse, ResponseType } from 'types'
import { RedisClient } from 'redis'

class Router {
  public constructor (private app: Application, private db: Database, private cache: RedisClient) {
    this.root()
    this.login()
    this.logout()
    this.online()
    this.register()
    this.lastSeen()
  }

  private root () {
    this.app.get('/isLogged', async (req: Request, res: Response): Promise<void> => {
      const { _id, password, ...rest }: Partial<User> = req.user || {}
      const user: Partial<User> = req.user
        ? {
            ...rest
          }
        : {
            username: '',
            color: '',
            lastSeen: 0,
            createdAt: 0
          }

      res.json({
        user,
        isLogged: req.isAuthenticated()
      })
    })
  }

  login () {
    this.app.post('/login', (req: Request, res: Response, next: NextFunction): void => {
      passport.authenticate('local', (err, user, info) => {
        let signResp: SignResponse

        if (err) {
          return next(err)
        }

        if (!user) {
          signResp = {
            isLogged: false,
            type: 'error',
            ...info
          }
          return res.json(signResp)
        }

        req.logIn(user, userErr => {
          if (userErr) {
            return next(userErr)
          }

          res.json({ isLogged: true, type: 'success', message: 'Successfully logged in' })
        })
      })(req, res, next)
    })
  }

  logout () {
    this.app.get('/logout', async (req: Request, res: Response): Promise<void> => {
      const { username }: { username: string } = req.body
      await this.db.disconnectUser(username)

      req.logout()
      res.json({ isLogged: false })
    })
  }

  lastSeen () {
    this.app.post('/lastSeen', async (req: Request, res: Response): Promise<void> => {
      const { username }: { username: string } = req.body

      this.cache.get(`lastseen__${username}`, async (_, result: any): Promise<void> => {
        if (result) {
          res.send(JSON.parse(result))
        } else {
          const lastSeen = await this.db.getLastSeen(username)

          this.cache.setex(`lastseen__${username}`, 200, JSON.stringify({ lastSeen }))
          res.json({ lastSeen })
        }
      })
    })
  }

  online () {
    this.app.get('/users', async (_: Request, res: Response): Promise<void> => {
      const users: User[] = await this.db.getUsers()

      res.json(users)
    })
  }

  register () {
    this.app.post('/register', async (req: Request, res: Response) => {
      const { username, password: plainPass }: User = req.body
      const password: string = await bcrypt.hash(plainPass, 10)
      const now: number = new Date().getTime()

      const colors: string[] = ['#673ab7', '#ff5722', '#009688', '#3f51b5', '#2196f3']
      const color: string = colors[Math.ceil(Math.random() * colors.length) - 1]

      const { type, message }: { type: ResponseType; message: string } = await this.db.createUser({
        username,
        password,
        color,
        createdAt: now,
        lastSeen: now
      })

      res.json({ isLogged: false, type, message })
    })
  }
}

export default Router
