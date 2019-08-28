import React, { memo } from 'react'
import TimeAgo from 'react-timeago'
import Skeleton from '@material-ui/lab/Skeleton'

type Prop = {
  time: number
}

const LastSeen: React.FunctionComponent<Prop> = ({ time }): JSX.Element => {
  const isLive = time === 0
  const isLoading = time === null

  return (
    <React.Fragment>
      Last seen: {!isLoading ? !isLive
        ? <TimeAgo date={time} live={false} /> : 'Now'
        : <Skeleton variant='rect' height={10} width='53%' style={{ display: 'inline-block'}} />}
    </React.Fragment>
  )
}

export default memo(LastSeen)
