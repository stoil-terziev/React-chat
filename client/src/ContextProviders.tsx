import React, { FunctionComponent } from 'react'
import UserProvider from 'context/User'
import NotificationProvider from 'context/Notification'
import SocketProvider from 'context/Socket'

const ContextProviders: FunctionComponent = ({ children }): JSX.Element => (
  <UserProvider>
    <SocketProvider>
      <NotificationProvider>
        {children}
      </NotificationProvider>
    </SocketProvider>
  </UserProvider>
)

export default ContextProviders
