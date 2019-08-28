import React, { memo, useReducer, useEffect, useContext, FunctionComponent, Reducer } from 'react'
import { Grid, Button, IconButton } from '@material-ui/core'
import VisibilityIcon from '@material-ui/icons/Visibility'
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff'
import Input from 'components/generic/Input'
import { UserContext } from 'context/User'
import { NotificationContext } from 'context/Notification'
import reducer, { initialState, State, Action } from 'reducers/register'

const Register: FunctionComponent = (): JSX.Element => {
  const [{ username, password, confirmPassword, passwordType, hasError }, dispatch] = useReducer<
    Reducer<State, Action>
  >(reducer, initialState)
  const { dispatch: loginDispatch } = useContext(UserContext)
  const notification = useContext(NotificationContext)
  const Icon: JSX.Element = passwordType ? <VisibilityOffIcon /> : <VisibilityIcon />

  const handlePassReveal = (): void => dispatch({ type: 'TOGGLE_PASS_TYPE' })
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

  const handleConfirmChange = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>): void =>
    dispatch({
      type: 'SET_PASSWORD_CONFIRM',
      payload: {
        value,
        type: 'confirmPassword'
      }
    })

  const handleRegister = async (): Promise<void> => {
    try {
      const response: Response = await window.fetch('/register', {
        method: 'post',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
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

  useEffect(
    () => {
      dispatch({ type: 'HANDLE_ERROR' })
    },
    [password, confirmPassword]
  )

  return (
    <Grid container>
      <Grid item>
        <form>
          <Input
            autoFocus
            autoComplete='username'
            label='username'
            value={username}
            onChange={handleUserChange}
          />
          <Input
            autoComplete='new-password'
            error={hasError}
            type={passwordType}
            label='password'
            endAdornment={
              <IconButton tabIndex={-1} onClick={handlePassReveal}>
                {Icon}
              </IconButton>
            }
            value={password}
            onChange={handlePassChange}
          />
          <Input
            autoComplete='new-password'
            error={hasError}
            type={passwordType}
            label='confirm password'
            endAdornment={
              <IconButton tabIndex={-1} onClick={handlePassReveal}>
                {Icon}
              </IconButton>
            }
            value={confirmPassword}
            onChange={handleConfirmChange}
          />
          <Button
            fullWidth
            disabled={hasError || !confirmPassword}
            variant='contained'
            size='large'
            color='primary'
            onClick={handleRegister}
          >
            Register
          </Button>
        </form>
      </Grid>
    </Grid>
  )
}

export default memo(Register)
