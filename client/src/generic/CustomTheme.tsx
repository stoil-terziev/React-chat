import React from 'react'
import { ThemeProvider, makeStyles } from '@material-ui/styles'
import { createMuiTheme } from '@material-ui/core/styles'
import blueGrey from '@material-ui/core/colors/blueGrey'
import blue from '@material-ui/core/colors/blue'
import background from 'bg.jpg'

const theme = createMuiTheme({
  palette: {
    primary: blue,
    secondary: blueGrey,
    background: {
      default: '#e8f1f2'
    }
  }
})

const useStyles = makeStyles({
  '@global': {
    body: {
      backgroundImage: `url(${background})`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: '30% 40%',
      backgroundSize: 'cover',
      backgroundAttachment: 'fixed'
    }
  }
})

const CustomTheme: React.FunctionComponent = (props): JSX.Element => {
  useStyles({})

  return (
    <ThemeProvider theme={theme} {...props}>
      {props.children}
    </ThemeProvider>
  )
}

export default CustomTheme
