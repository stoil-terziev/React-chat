import { ObjectId } from 'bson'

export type ResponseType = 'success' | 'error'

export type User = {
  _id?: string
  password?: string
  username: string
  color: string
  createdAt: number
  lastSeen: number
}

export type EnhancedSocket = SocketIO.Socket & Partial<User>

export type Message = {
  id?: string
  user?: ObjectId | User
  message: string
  type: 'message' | 'join' | 'leave'
  date?: number
  sent?: boolean
}

export type SignResponse = Message & {
  isLogged: boolean
}

export type Messages = User & Message

export type errorObject = {
  eacces: string
  eaddrinuse: string
  [key: string]: string
}

export type NewMessage = {
  id: string,
  username: string,
  message: string
}