import http from 'http'
import SocketIO from 'socket.io'
import Database from 'Database'
import { NewMessage, Message, EnhancedSocket } from 'types'
import { ObjectId } from 'bson'

class Socket {
  private server: SocketIO.Server

  public constructor (server: http.Server, private db: Database) {
    this.server = SocketIO(server)

    this.config()
  }

  private config (): void {
    this.server.on('connection', (socket: EnhancedSocket): void => {
      socket.once('disconnect', (): Promise<void> => this.disconnect(socket.username as string))
      socket.on('join', async (username: string): Promise<void> => this.join(username, socket))
      socket.on('chat message', ({ id, message }: Partial<Message>): Promise<void> =>
        this.createMessage({ id, message, username: socket.username } as NewMessage)
      )
      socket.on('fetch messages', (): Promise<void> => this.fetch(socket))
      socket.on('request online', (): Promise<void> => this.getOnline())
    })
  }

  private async createMessage ({ id, message, username }: NewMessage): Promise<void> {
    const user = await this.db.getUser(username)

    const newMessage: Message = {
      id,
      message,
      user: new ObjectId(user._id),
      date: new Date().getTime(),
      type: 'message',
      sent: true
    }

    await this.db.createMessage(newMessage)
    newMessage.user = user
    setTimeout(() => {
      this.server.emit('chat message', newMessage)
    }, 2000)
  }

  private async fetch (socket: EnhancedSocket): Promise<void> {
    const messages = await this.db.getMessages()

    socket.emit('fetch messages', messages)
  }

  private async join (username: string, socket: EnhancedSocket): Promise<void> {
    await this.db.joinUser(username)
    const { color } = await this.db.getUser(username)
    socket.username = username
    socket.color = color

    const message: Message = {
      message: `${username} joined`,
      type: 'join'
    }

    socket.broadcast.emit('user activity', message)
    this.getOnline()
  }

  private async disconnect (username: string): Promise<void> {
    if (username) {
      await this.db.disconnectUser(username)

      const message: Message = {
        message: `${username} left`,
        type: 'leave'
      }

      this.server.emit('user activity', message)
      this.getOnline()
    }
  }

  private async getOnline (): Promise<void> {
    const online = await this.db.getOnline()

    this.server.emit('online', online)
  }
}

export default Socket
