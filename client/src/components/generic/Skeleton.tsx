import React, { Fragment, memo, FunctionComponent } from 'react'
import { ListItem, ListItemAvatar, Theme } from '@material-ui/core'
import { default as MuiSkeleton } from '@material-ui/lab/Skeleton'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles(({ spacing }: Theme) => ({
  placeholder: {
    padding: `${spacing(0.5)}px ${spacing(2)}px`
  }
}))

type Props = Partial<{
  width: number | string
  number: number
}>

const Skeleton: FunctionComponent<Props> = ({ width = '100%', number = 1 }): JSX.Element => {
  const classes = useStyles({})

  return (
    <Fragment>
      {Array.from({ length: number }).map((_, index: number) => (
        <ListItem key={`sp_${index}`}>
          <ListItemAvatar>
            <MuiSkeleton variant='circle' height={40} width={40} className={classes.placeholder} />
          </ListItemAvatar>
          <MuiSkeleton variant='rect' width={width} height={20} />
        </ListItem>
      ))}
    </Fragment>
  )
}

export default memo(Skeleton)
