import React, { useEffect, useReducer, useContext, useRef, Reducer } from 'react'
import { Redirect } from 'react-router-dom'
import {
  Typography,
  Grid,
  Paper,
  Hidden,
  List,
  InputBase,
  IconButton,
  Theme,
  RootRef
} from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import blue from '@material-ui/core/colors/blue'
import SendIcon from '@material-ui/icons/SendRounded'
import clsx from 'clsx'
import nanoid from 'nanoid'
import { fade } from '@material-ui/core/styles/colorManipulator'

import { UserContext } from 'context/User'
import { SocketContext } from 'context/Socket'

import UserMessage from 'components/User/Message'
import Activity from 'components/generic/Activity'
import Online from 'components/Online'
import Logout from 'components/Sign/Logout'
import Skeleton from 'components/generic/Skeleton'
import reducer, { initialState, State, Action } from 'reducers/main'

const useStyles = makeStyles(({ spacing }: Theme) => ({
  height: {
    height: '80vh',
    minHeight: 500
  },
  paper: {
    backgroundColor: fade('#fff', 0.9)
  },
  online: {
    padding: `${spacing(1.5)}px ${spacing(0.75)}px`,
    textAlign: 'center',
    wordWrap: 'break-word'
  },
  messages: {
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
  icon: {
    cursor: 'pointer',
    paddingLeft: spacing(2),
    color: blue[500]
  },
  input: {
    fontSize: '1.5rem',
    padding: '8px 16px'
  },
  hidden: {
    display: 'none'
  },
  join: {
    fontWeight: 'bold',
    fontSize: '2em'
  },
  hideOverflow: {
    overflow: 'hidden'
  }
}))

const Index: React.FunctionComponent = () => {
  const [{ isLoading, placeholder, message, messages }, dispatch] = useReducer<Reducer<State, Action>>(
    reducer,
    initialState
  )
  const notFocused: string = 'What do you want to say?'
  const classes = useStyles({})
  const { username, color, createdAt, isLogged } = useContext(UserContext)
  const client = useContext(SocketContext)
  const scrollRef = useRef<HTMLDivElement>(null)

  const scrollToLast = (animate: boolean = false): void => {
    if (scrollRef.current) {
      scrollRef.current.style.scrollBehavior = animate ? 'smooth' : 'auto'
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }

  const keyPress = ({ key }: { key: string }): void => {
    if (key === 'Enter') {
      send()
    }
  }

  const update = ({ target: { value: message } }: { target: { value: string } }): void =>
    dispatch({
      type: 'SET_MESSAGE',
      payload: message
    })

  const send = (): void => {
    if (message) {
      const id = nanoid()
      client.emit('chat message', { id, message })

      dispatch({
        type: 'NEW_MESSAGE',
        payload: {
          id,
          user: {
            username,
            color,
            createdAt,
            lastSeen: 0
          },
          message,
          type: 'message',
          date: new Date().getTime(),
          sent: false
        }
      })

      scrollToLast()
    }

    dispatch({ type: 'RESET_MESSAGE' })
  }

  const handleFocusChange = (value: string) => () => dispatch({ type: 'SET_PLACEHOLDER', payload: value })

  useEffect(
    () => {
      if (username) {
        client.open()
        client.emit('join', username)
      }
    },
    [username, client]
  )

  useEffect(
    () => {
      if (username) {
        client.on('chat message', (message: Message): void => {
          dispatch({
            type: 'SET_MESSAGES',
            payload: message
          })

          scrollToLast(true)
        })

        client.on('user activity', ({ message, type }: Info): void => {
          dispatch({
            type: 'NEW_MESSAGE',
            payload: { type, message }
          })
        })

        client.on('fetch messages', (messages: Message[]): void => {
          dispatch({
            type: 'FETCH_MESSAGES',
            payload: messages
          })

          if (scrollRef.current) {
            scrollToLast()
          }
        })

        client.emit('fetch messages')
      }
      return () => {
        client.removeAllListeners()
        client.disconnect()
      }
    },
    [username, client]
  )

  useEffect(
    () => {
      if (messages.length) {
        scrollToLast(true)
      }
    },
    [messages.length]
  )

  if (!isLogged) {
    return <Redirect to='/sign' />
  }

  if (!username) {
    return null
  }

  const allMessages: Messages[] = messages.map((message: Messages, index: number): Messages => {
    const currentMessage: Messages =
      message.type === 'message'
        ? ((
            <UserMessage
              key={index}
              user={message.user}
              message={message.message}
              date={message.date}
              sent={message.sent}
            />
          ) as unknown) as Message
        : (<Activity key={index} message={message.message} type={message.type} /> as unknown) as Info

    return currentMessage
  })

  return (
    <Grid container justify='center'>
      <Hidden smDown>
        <Grid
          item
          md={4}
          lg={2}
          component={Paper}
          square
          elevation={2}
          className={clsx(classes.height, classes.paper, classes.online)}
        >
          <Online />
        </Grid>
      </Hidden>
      <Grid
        item
        xs={12}
        sm={10}
        md={8}
        lg={5}
        xl={4}
        component={Paper}
        square
        elevation={1}
        className={clsx(classes.height, classes.paper, { [classes.hideOverflow]: isLoading })}
      >
        {!isLoading ? allMessages.length ? (
          <RootRef rootRef={scrollRef}>
            <List disablePadding dense className={clsx(classes.height, classes.messages)}>
              {allMessages}
            </List>
          </RootRef>
        ) : (
          <Typography variant='h6' align='center' color='secondary'>
            No Messages
          </Typography>
        ) : (
          <Skeleton number={15} />
        )}
      </Grid>
      <Grid container justify='center' style={{ zIndex: 1 }}>
        <Hidden smDown>
          <Grid item md={4} lg={2}>
            <Paper square elevation={2} style={{ height: 64 }}>
              <Logout />
            </Paper>
          </Grid>
        </Hidden>
        <Grid
          item
          xs={12}
          sm={10}
          md={8}
          lg={5}
          xl={4}
          component={Paper}
          square
          elevation={2}
          className={classes.paper}
        >
          <InputBase
            fullWidth
            autoFocus
            value={message}
            className={classes.input}
            inputProps={{
              style: {
                textAlign: 'center'
              }
            }}
            endAdornment={
              <IconButton color='primary' className={classes.icon} onClick={send}>
                <SendIcon />
              </IconButton>
            }
            placeholder={placeholder}
            onChange={update}
            onKeyPress={keyPress}
            onFocus={handleFocusChange('')}
            onBlur={handleFocusChange(notFocused)}
          />
        </Grid>
      </Grid>
    </Grid>
  )
}

export default React.memo(Index)
