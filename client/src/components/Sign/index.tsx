import React, { useState, useContext, FunctionComponent } from 'react'
import { Redirect } from 'react-router'
import { Grid, Paper, Tabs, Tab } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'

import { UserContext } from 'context/User'
import Login from './Login'
import Register from './Register'

const useStyles = makeStyles({
  root: {
    padding: '2rem'
  }
})

const Sign: FunctionComponent = (): JSX.Element | null => {
  const [active, setActive] = useState(0)
  const { isLogged } = useContext(UserContext)
  const classes = useStyles({})

  const handleActiveChange = (_: React.ChangeEvent<{}>, value: number) => setActive(value)

  if (isLogged === null) {
    return null
  }

  if (isLogged) {
    return <Redirect to='/' />
  }

  return (
    <Grid container justify='center'>
      <Grid item xs={12} sm={7} md={6} lg={5} xl={4} component={Paper} elevation={8} className={classes.root}>
        <Paper square>
          <Tabs
            style={{
              marginBottom: 15
            }}
            variant='fullWidth'
            value={active}
            indicatorColor='primary'
            textColor='secondary'
            onChange={handleActiveChange}
          >
            <Tab label='Login' />
            <Tab label='Register' />
          </Tabs>
        </Paper>
        {active === 0 && <Login />}
        {active === 1 && <Register />}
      </Grid>
    </Grid>
  )
}

export default Sign
