import React, { memo } from 'react'
import { Snackbar, SnackbarContent } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import red from '@material-ui/core/colors/red'
import green from '@material-ui/core/colors/green'
import clsx from 'clsx'
import Message from './Message'

const useStyles = makeStyles({
  snackPosition: {
    top: 20
  },
  center: {
    justifyContent: 'center'
  },
  error: {
    backgroundColor: red[600]
  },
  success: {
    backgroundColor: green[600]
  }
})

type Props = {
  hideIn?: number
  variant: ResponseTypes
  isOpen: boolean
  message: string
  onClose: (_: any, reason: string) => void
  onExited: () => void
}

const Notification: React.FunctionComponent<Props> = ({
  hideIn = 4000,
  variant,
  isOpen,
  message,
  onClose,
  onExited
}): JSX.Element => {
  const classes = useStyles({})

  return (
    <Snackbar
      className={classes.snackPosition}
      open={isOpen}
      autoHideDuration={hideIn}
      onClose={onClose}
      onExited={onExited}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'center'
      }}
    >
      <SnackbarContent
        className={clsx(classes.center, classes[variant])}
        message={<Message text={message} variant={variant} />}
      />
    </Snackbar>
  )
}

export default memo(Notification)
