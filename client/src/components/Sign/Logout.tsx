import React, { memo, useContext } from 'react'
import { Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { UserContext } from 'context/User'

const useStyles = makeStyles({
  root: {
    fontSize: '1.5rem',
    height: '100%',
    borderRadius: 0
  }
})

const Logout: React.FunctionComponent = (): JSX.Element => {
  const { dispatch } = useContext(UserContext)
  const classes = useStyles({})

  const handleLogout = async (): Promise<void> => {
    const response = await fetch('/logout', {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    })
    try {
      const { isLogged } = await response.json()

      dispatch({ type: 'SET_LOGIN_STATE', payload: isLogged })
    } catch (error) {
      dispatch({ type: 'HANDLE_ERROR' })
    }
  }

  return (
    <Button
      fullWidth
      className={classes.root}
      variant='contained'
      size='large'
      color='primary'
      onClick={handleLogout}
    >
      Logout
    </Button>
  )
}

export default memo(Logout)
