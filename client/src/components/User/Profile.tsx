import React, { memo, useEffect, useState } from 'react'
import TimeAgo from 'react-timeago'
import { Grid, Paper, Typography, Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import Avatar from 'components/generic/Avatar'
import LastSeen from 'components/generic/LastSeen'

type StyleProps = Partial<{
  color: string
  isOnline: number | null
}>

const useStyles = makeStyles(({ spacing }: Theme) => ({
  root: {
    minWidth: 200,
    padding: `${spacing(1.5)}px ${spacing(2)}px`
  },
  username: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing(1)
  },
  onlineStatus: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: spacing(1.5),
    height: spacing(1.5),
    borderRadius: '50%',
    border: '2px solid white',
    boxShadow: `0 0 1px black`,
    backgroundColor: ({ isOnline }: StyleProps): string => {
      switch (isOnline) {
        case null:
          return 'grey'
        case 0:
          return '#42b72a'
        default:
          return 'tomato'
      }
    }
  },
  resetLineheight: {
    lineHeight: 1
  }
}))

const UserProfile: React.FunctionComponent<User> = ({ username, color, createdAt }): JSX.Element => {
  const [lastSeen, setLastSeen] = useState<number | null>(null)
  const classes = useStyles({ isOnline: lastSeen })

  useEffect(
    () => {
      let isMounted = true

      const getLastSeen = async () => {
        const response = await fetch('/lastSeen', {
          method: 'post',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ username })
        })
        const { lastSeen } = await response.json()

        isMounted && setLastSeen(lastSeen)
      }

      getLastSeen()

      return () => {
        isMounted = false
      }
    },
    [username]
  )

  const created = new Date(createdAt)

  return (
    <Grid container>
      <Grid item component={Paper} className={classes.root}>
        <div className={classes.username}>
          <Avatar profile username={username} color={color}>
            <span className={classes.onlineStatus} />
          </Avatar>
          <Typography variant='h5' gutterBottom>
            {username}
          </Typography>
        </div>
        <Typography variant='overline' className={classes.resetLineheight}>
          Registered <TimeAgo date={created} live={false} />
        </Typography>
        <br />
        <Typography variant='overline' className={classes.resetLineheight}>
          <LastSeen time={lastSeen} />
        </Typography>
      </Grid>
    </Grid>
  )
}

export default memo(UserProfile)
