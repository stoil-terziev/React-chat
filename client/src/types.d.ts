declare type User = {
  username: string
  color: string
  createdAt: number
  lastSeen: number
}

type MessageBase = {
  id?: string
  message: string
  date?: number
  key?: any
}

declare type Info = MessageBase & {
  type: 'join' | 'leave'
}

declare type Message = MessageBase & Partial<User> & {
  type?: 'message'
  sent: boolean
  user?: User
}

declare type Messages = Message | Info

declare type ResponseTypes = 'success' | 'error'

declare type LoginResponse = {
  isLogged: boolean
  type: ResponseTypes
  message: string
}
