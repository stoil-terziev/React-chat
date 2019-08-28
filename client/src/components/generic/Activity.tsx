import React, { memo } from 'react'
import Typography from '@material-ui/core/Typography'

type Prop = {
  type: 'join' | 'leave'
  message: string
}

const Activity: React.FunctionComponent<Prop> = ({ type, message }): JSX.Element => (
  <Typography variant='h6' align='center' color={type === 'join' ? 'secondary' : 'error'}>
    {message}
  </Typography>
)

export default memo(Activity)
