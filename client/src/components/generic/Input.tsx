import React from 'react'
import TextField, { TextFieldProps } from '@material-ui/core/TextField'
import InputAdornment from '@material-ui/core/InputAdornment'
import { InputBaseProps } from '@material-ui/core/InputBase'
import { makeStyles } from '@material-ui/styles'
import clsx from 'clsx'

const useStyles = makeStyles({
  input: {
    height: '18.18182px'
  },
  marginBottom: {
    marginBottom: 18
  }
})

type Adornment = {
  startAdornment: JSX.Element
  endAdornment: JSX.Element
}

type Props = TextFieldProps & InputBaseProps & {
  noMarginBottom?: boolean
}

const Input: React.FunctionComponent<Props> = ({
  autoFocus = false,
  fullWidth = true,
  error = false,
  noMarginBottom = false,
  value = '',
  autoComplete = '',
  type = 'text',
  className,
  label,
  startAdornment,
  endAdornment,
  onChange
}): JSX.Element => {
  const classes = useStyles({})
  const adornmentStart: Partial<Adornment> | null = startAdornment
    ? { startAdornment: <InputAdornment position='start'>{startAdornment}</InputAdornment> }
    : null

  const adornmentEnd: Partial<Adornment> | null = endAdornment
    ? { endAdornment: <InputAdornment position='end'>{endAdornment}</InputAdornment> }
    : null

  return (
    <TextField
      className={clsx(className, { [classes.marginBottom]: !noMarginBottom })}
      autoFocus={autoFocus}
      fullWidth={fullWidth}
      autoComplete={autoComplete}
      error={error}
      type={type}
      variant='outlined'
      label={label}
      value={value}
      onChange={onChange}
      InputProps={{
        inputProps: {
          className: classes.input
        },
        ...adornmentStart,
        ...adornmentEnd
      }}
    />
  )
}

export default Input
