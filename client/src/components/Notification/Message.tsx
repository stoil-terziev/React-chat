import React from 'react'
import { Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import ErrorIcon from '@material-ui/icons/Error'
import CheckIcon from '@material-ui/icons/CheckCircle'
import { SvgIconProps } from '@material-ui/core/SvgIcon'

const useStyles = makeStyles({
  root: {
    display: 'flex',
    alignItems: 'center'
  },
  message: {
    fontWeight: 500,
    lineHeight: 1.5,
    letterSpacing: '0.083em'
  },
  icon: {
    fontSize: 22,
    marginRight: 8,
    opacity: 0.9
  }
})

type IconType = {
  success: React.ComponentType<SvgIconProps>
  error: React.ComponentType<SvgIconProps>
}

type Prop = {
  text: string
  variant: 'success' | 'error'
}

const NotificationMessage: React.FunctionComponent<Prop> = ({ text, variant }): JSX.Element => {
  const classes = useStyles({})
  const icons: IconType = { success: CheckIcon, error: ErrorIcon } as const
  const Icon: typeof icons[keyof typeof icons] = icons[variant]

  return (
    <span className={classes.root}>
      <Icon className={classes.icon} />
      <Typography variant='overline' color='inherit' className={classes.message}>
        {text}
      </Typography>
    </span>
  )
}

export default NotificationMessage
