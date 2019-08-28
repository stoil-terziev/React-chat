import { MongoClient, Collection, InsertOneWriteOpResult } from 'mongodb'
import { ObjectId } from 'bson'
import { User, Message, ResponseType } from 'types'
import { RedisClient } from 'redis'



class Database {
  private users: Collection<User>
  private messages: Collection<Message>
  private online: Collection<User>
  private cache: RedisClient

  public constructor (cache: RedisClient) {
    this.cache = cache
    this.config()
  }

  private async config (): Promise<void> {
    const client: MongoClient = await MongoClient.connect(process.env.DB as string, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })

    this.users = client.db().collection('users')
    this.messages = client.db().collection('messages')
    this.online = client.db().collection('online')
  }

  public async getUser (username: string): Promise<User> {
    const user: User = (await this.users.findOne({ username: new RegExp(`^${username}$`, 'i') })) as User

    return user
  }

  public async getUserByid (id: string): Promise<User> {
    const user: User = (await this.users.findOne({ _id: (new ObjectId(id) as unknown) as string })) as User

    return user
  }

  public async getUsers (): Promise<User[]> {
    const users: User[] = await this.users.find().toArray()

    return users
  }

  public async getMessages (): Promise<Message[]> {
    const messages: Message[] = await this.messages
      .aggregate([
        {
          $lookup: {
            from: 'users',
            localField: 'user',
            foreignField: '_id',
            as: 'user'
          }
        },
        { $unwind: '$user' },
        {
          $project: {
            _id: 0,
            id: 1,
            message: 1,
            date: 1,
            type: 1,
            sent: 1,
            user: {
              username: 1,
              color: 1,
              lastSeen: 1,
              createdAt: 1
            }
          }
        }
      ])
      .toArray()

    return messages
  }

  public async createUser (user: User): Promise<{ type: ResponseType; message: string }> {
    const userExists: boolean = ((await this.getUser(user.username)) as unknown) as boolean

    if (!userExists) {
      const { result: { ok } }: InsertOneWriteOpResult = await this.users.insertOne(user)

      if (ok) {
        return {
          type: 'success',
          message: `${user.username} has been successfully registered`
        }
      }

      return {
        type: 'error',
        message: 'Something went wrong, please try again'
      }
    }

    return {
      type: 'error',
      message: `${user.username} already exists`
    }
  }

  public async createMessage (message: Message): Promise<{ type: ResponseType }> {
    const { result: { ok } }: InsertOneWriteOpResult = await this.messages.insertOne(message)

    if (ok) {
      return {
        type: 'success'
      }
    }

    return {
      type: 'error'
    }
  }

  public async joinUser (username: string): Promise<void> {
    await this.users.findOneAndUpdate({ username }, { $set: { lastSeen: 0 } })
    const user: User = await this.getUser(username)
    const isOnline: boolean = (await this.online.findOne({ username })) as boolean

    if (!isOnline) {
      await this.online.insertOne(user)
    }
  }

  public async disconnectUser (username: string): Promise<void> {
    const lastSeen = new Date().getTime()

    this.cache.get(`lastseen__${username}`, async (_, result: any): Promise<void> => {
      if (result) {
        this.cache.del(`lastseen__${username}`)
      }
    })

    await this.online.deleteOne({ username })
    await this.users.findOneAndUpdate({ username }, { $set: { lastSeen } })
  }

  public async getOnline (): Promise<User[]> {
    const online: User[] = await this.online.find().project({ _id: 0 }).toArray()

    return online
  }

  public async getLastSeen (username: string): Promise<number> {
    const user: User[] = await this.users.aggregate([
      { $match: { username } },
      { $project: { _id: 0, lastSeen: 1}}
    ]).toArray()

    return user[0] ? user[0].lastSeen : 0
  }

  public async isOnline (username: string): Promise<boolean> {
    const online: boolean = (await this.online.find({ username }).count()) > 0

    return online
  }
}

export default Database
