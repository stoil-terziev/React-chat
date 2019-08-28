import React, { memo, FunctionComponent } from 'react'
import {
  Typography,
  Tooltip,
  Zoom,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Theme
} from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import DoneAllIcon from '@material-ui/icons/DoneAll'
import DoneIcon from '@material-ui/icons/Done'
import TimeAgo from 'react-timeago'
import clsx from 'clsx'
import UserAvatar from 'components/User/Avatar'

const useStyles = makeStyles(({ spacing, shadows, palette }: Theme) => ({
  item: {
    paddingTop: 0,
    paddingBottom: spacing(0.5)
  },
  message: {
    lineHeight: 1.3
  },
  tooltip: {
    backgroundColor: palette.common.white,
    color: palette.text.primary,
    boxShadow: shadows[1],
    fontSize: spacing(2.2)
  },
  notSent: {
    opacity: 0.6
  }
}))

const UserMessage: FunctionComponent<Message> = ({ user, message, date, sent }): JSX.Element => {
  const classes = useStyles({})

  return (
    <ListItem
      className={clsx(classes.item, {
        [classes.notSent]: !sent
      })}
    >
      <ListItemAvatar>
        <UserAvatar user={user} />
      </ListItemAvatar>
      <ListItemText
        disableTypography
        primary={<Typography variant='subtitle2'>{user.username}</Typography>}
        secondary={
          <Typography variant='subtitle1' className={classes.message}>
            {message}
          </Typography>
        }
      />
      <ListItemSecondaryAction>
        <Tooltip
          TransitionComponent={Zoom}
          classes={{ tooltip: classes.tooltip }}
          title={<TimeAgo date={date} live={false} />}
        >
          {sent ? <DoneAllIcon /> : <DoneIcon />}
        </Tooltip>
      </ListItemSecondaryAction>
    </ListItem>
  )
}

export default memo(UserMessage)
