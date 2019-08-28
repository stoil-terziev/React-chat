import React, { PureComponent } from 'react'
import { Grid, Paper, Typography, Theme } from '@material-ui/core'
import { withStyles, WithStyles } from '@material-ui/styles'
import { GridProps } from '@material-ui/core/Grid'

const styles = ({ transitions, shadows, spacing }: Theme) => ({
  root: {
    cursor: 'pointer',
    marginTop: spacing(8),
    padding: spacing(3),
    transition: transitions.create('box-shadow', {
      duration: transitions.duration.standard,
      easing: transitions.easing.sharp
    }),
    '&:hover': {
      boxShadow: shadows[12]
    }
  }
})

type Props = WithStyles<typeof styles> & GridProps

type State = {
  readonly error: Error | null
}

class ErrorBoundary extends PureComponent<Props, State> {
  readonly state: State = {
    error: null
  }

  componentDidCatch (error: Error | null): void {
    this.setState({ error })
  }

  render (): React.ReactNode {
    const { error } = this.state
    const { children, classes, ...rest } = this.props

    if (error) {
      return (
        <Grid container justify='center'>
          <Grid item xs={12} sm={9} md={7} lg={6} xl={4} {...rest}>
            <Paper className={classes.root} elevation={6}>
              <Typography variant='h4' paragraph color='secondary' align='center'>
                Something went wrong
              </Typography>
              <Typography variant='h5' color='error' align='center'>
                {error.toString()}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      )
    }

    return children
  }
}

export default withStyles(styles)(ErrorBoundary)
