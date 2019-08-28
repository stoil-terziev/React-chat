import React, { memo, FunctionComponent } from 'react'
import { Typography, ListItem, ListItemAvatar, ListItemText, Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import UserAvatar from 'components/UserAvatar'

const useStyles = makeStyles(({ spacing }: Theme) => ({
  root: {
    paddingTop: spacing(0.5),
    paddingBottom: spacing(0.5)
  }
}))

const OnlineUser: FunctionComponent<{ user: User }> = ({ user }): JSX.Element => {
  const classes = useStyles({})

  return (
    <ListItem button className={classes.root}>
      <ListItemAvatar>
        <UserAvatar user={user} />
      </ListItemAvatar>
      <ListItemText disableTypography>
        <Typography variant='body1'>{user.username}</Typography>
      </ListItemText>
    </ListItem>
  )
}

export default memo(OnlineUser)
