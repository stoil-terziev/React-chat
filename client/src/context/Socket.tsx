import React, { createContext, Context } from 'react'
import io from 'socket.io-client'

export const SocketContext: Context<SocketIOClient.Socket> = createContext({} as SocketIOClient.Socket)

const socket: SocketIOClient.Socket = io('http://localhost:3001', {
  autoConnect: false
})

const SocketProvider: React.FunctionComponent = ({ children }): JSX.Element => (
  <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
)



export default SocketProvider
