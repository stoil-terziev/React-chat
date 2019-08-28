import React from 'react'
import { Link } from 'react-router-dom'
import { Grid, Paper, Typography, Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles(({ transitions, shadows, spacing }: Theme) => ({
  root: {
    marginTop: spacing(8)
  },
  paper: {
    cursor: 'pointer',
    padding: spacing(3),
    textAlign: 'center',
    transition: transitions.create('box-shadow', {
      duration: transitions.duration.standard,
      easing: transitions.easing.sharp
    }),
    '&:hover': {
      boxShadow: shadows[12]
    }
  },
  link: {
    color: 'rgba(0, 0, 0, 0.67)'
  }
}))

const NotFound: React.FunctionComponent = (): JSX.Element => {
  const classes = useStyles({})

  return (
    <Grid container justify='center' className={classes.root}>
      <Grid
        item
        xs={12}
        sm={10}
        md={9}
        lg={8}
        xl={5}
        component={Paper}
        elevation={6}
        className={classes.paper}
      >
        <Typography variant='h4' color='secondary' align='center' gutterBottom>
          The page you are looking for doesn't exist
        </Typography>
        <Typography variant='h4'>
          <Link to='/' className={classes.link}>
            Go back home
          </Link>
        </Typography>
      </Grid>
    </Grid>
  )
}
export default NotFound
