import React, { memo, useContext, useState, useEffect, Fragment } from 'react'
import { Typography, List } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import blue from '@material-ui/core/colors/blue'
import clsx from 'clsx'

import { SocketContext } from 'context/Socket'
import OnlineUser from 'components/Online/User'
import Skeleton from 'components/generic/Skeleton'

const useStyles = makeStyles({
  root: {
    height: '100%',
    wordWrap: 'break-word',
    overflowY: 'auto',
    '&::-webkit-scrollbar': {
      width: 10,
      backgroundColor: blue[50]
    },
    '&::-webkit-scrollbar-track': {
      boxShadow: 'inset 0 0 1px rgba(0, 0, 0, 0.3)'
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: blue[500],
      borderRadius: 10
    }
  },
  hideOverflow: {
    overflow: 'hidden'
  }
})

const Online: React.FunctionComponent = (): JSX.Element => {
  const [onlineUsers, setOnlineUsers] = useState<User[]>([])
  const client = useContext(SocketContext)
  const classes = useStyles({})

  useEffect(
    () => {
      client.on('online', (users: User[]): void => {
        setOnlineUsers(users)
      })

      return () => {
        client.removeAllListeners()
      }
    },
    [client]
  )

  const users: JSX.Element[] = onlineUsers.map((user: User, index: number): JSX.Element => (
    <OnlineUser key={`ou_${index}`} user={user} />
  ))

  return (
    <Fragment>
      <Typography variant='h5' color='secondary' gutterBottom>
        People online: {onlineUsers.length}
      </Typography>
      <List
        dense
        disablePadding
        className={clsx(classes.root, { [classes.hideOverflow]: !onlineUsers.length })}
      >
        {onlineUsers.length ? users : <Skeleton number={15} width='70%' />}
      </List>
    </Fragment>
  )
}

export default memo(Online)
