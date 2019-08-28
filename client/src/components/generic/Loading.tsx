import React, { FunctionComponent } from 'react'
import { CircularProgress, Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles(({ spacing }: Theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  progress: {
    margin: spacing(2)
  }
}))

type Props = Partial<{
  size: number
  thickness: number
}>

const Loading: FunctionComponent<Props> = ({ size = 100, thickness = 5 }): JSX.Element => {
  const classes = useStyles({})

  return (
    <div className={classes.root}>
      <CircularProgress size={size} thickness={thickness} className={classes.progress} />
    </div>
  )
}

export default Loading
