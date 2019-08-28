import React, { memo } from 'react'
import MuiAvatar from '@material-ui/core/Avatar'

type Props = {
  username: string
  color: string
  profile?: boolean
  [key: string]: any
}

const Avatar: React.FunctionComponent<Props> = ({
  username,
  color,
  children,
  profile = false,
  ...rest
}): JSX.Element => {
  const profileStyles = profile ? { marginRight: 8, overflow: 'unset' } : {}

  return (
    <MuiAvatar
      style={{
        backgroundColor: color,
        ...profileStyles
      }}
      {...rest}
    >
      {username.substring(0, 1).toUpperCase()}
      {children}
    </MuiAvatar>
  )
}
export default memo(Avatar, () => true)
