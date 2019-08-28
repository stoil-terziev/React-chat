import React, { memo, useContext, useReducer, Reducer } from 'react'
import { Grid, Button, IconButton } from '@material-ui/core'
import VisibilityIcon from '@material-ui/icons/Visibility'
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff'

import Input from 'components/generic/Input'
import { UserContext } from 'context/User'
import { NotificationContext } from 'context/Notification'
import reducer, { initialState, State, Action } from 'reducers/login'

const Login: React.FunctionComponent = (): JSX.Element => {
  const [{ username, password, passwordType }, dispatch] = useReducer<Reducer<State, Action>>(
    reducer,
    initialState
  )
  const { dispatch: loginDispatch } = useContext(UserContext)
  const notification = useContext(NotificationContext)
  const Icon: JSX.Element = passwordType === 'password' ? <VisibilityOffIcon /> : <VisibilityIcon />

  const handleUserChange = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>): void =>
    dispatch({
      type: 'SET_USERNAME',
      payload: {
        value,
        type: 'username'
      }
    })

  const handlePassChange = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>): void =>
    dispatch({
      type: 'SET_PASSWORD',
      payload: {
        value,
        type: 'password'
      }
    })

  const handleTypeChange = (): void => dispatch({ type: 'TOGGLE_PASS_TYPE' })

  const handleLogin = async (): Promise<void> => {
    try {
      const response: Response = await window.fetch('/login', {
        method: 'post',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ username, password })
      })

      const { isLogged, message: text, type }: LoginResponse = await response.json()

      loginDispatch({ type: 'SET_LOGIN_STATE', payload: isLogged })
      notification({
        type: 'SET_NOTIFICATION',
        payload: { type, text }
      })
    } catch (error) {
      loginDispatch({ type: 'HANDLE_ERROR' })
      notification({ type: 'HANDLE_ERROR' })
    }
  }

  return (
    <Grid container>
      <form style={{ width: '100%' }}>
        <Grid item>
          <Input
            autoFocus
            autoComplete='username'
            label='username'
            value={username}
            onChange={handleUserChange}
          />
          <Input
            autoComplete='current-password'
            type={passwordType}
            label='password'
            endAdornment={
              <IconButton tabIndex={-1} onClick={handleTypeChange}>
                {Icon}
              </IconButton>
            }
            value={password}
            onChange={handlePassChange}
          />
          <Button
            fullWidth
            disabled={!username || !password}
            variant='contained'
            size='large'
            color='primary'
            onClick={handleLogin}
          >
            Login
          </Button>
        </Grid>
      </form>
    </Grid>
  )
}

export default memo(Login)
