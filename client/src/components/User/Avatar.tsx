import React, { memo, useState } from 'react'
import { Popover } from '@material-ui/core'
import UserProfile from 'components/User/Profile'
import Avatar from 'components/generic/Avatar'

const UserAvatar: React.FunctionComponent<{ user: User }> = ({ user }): JSX.Element => {
  const [anchorEl, setAnchorEl] = useState(null)

  const handleHover = ({ currentTarget }: React.MouseEvent<HTMLDivElement>): void =>
    setAnchorEl(currentTarget)
  const handleClose = (): void => setAnchorEl(null)

  return (
    <React.Fragment>
      <Avatar
        username={user.username}
        color={user.color}
        onMouseEnter={handleHover}
        onMouseLeave={handleClose}
      />
      <Popover
        style={{ pointerEvents: 'none' }}
        open={!!anchorEl}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}
        onClose={handleClose}
      >
        <UserProfile {...user} />
      </Popover>
    </React.Fragment>
  )
}

export default memo(UserAvatar)
