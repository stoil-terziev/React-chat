import bcrypt from 'bcrypt'
import passport from 'passport'
import { Strategy } from 'passport-local'
import Database from 'Database'
import { User } from 'types'

class Authorization {
  constructor (private db: Database) {
    this.config()
  }

  private config (): void {
    passport.use(
      new Strategy(async (username, password, done): Promise<void> => {
        let user: User

        try {
          user = await this.db.getUser(username)

          if (!user) {
            return done(null, false, { message: `${username} doesn't exist` })
          }
        } catch (err) {
          return done(err)
        }

        const isValid: boolean = await bcrypt.compare(password, user.password as string)

        if (!isValid) {
          return done(null, false, { message: 'Wrong password' })
        }

        return done(null, user)
      })
    )
    passport.serializeUser(({ _id: id }: Partial<User>, done): void => {
      done(null, id)
    })

    passport.deserializeUser(async (id: string, done): Promise<void> => {
      try {
        let user: User = await this.db.getUserByid(id)

        if (!user) {
          return done('User not found')
        }
        done(null, user)
      } catch (e) {
        done(e)
      }
    })
  }
}

export default Authorization
