import React, { Fragment } from 'react'
import { CssBaseline, Grid } from '@material-ui/core'
import CustomTheme from 'generic/CustomTheme'
import ErrorBoundary from 'generic/ErrorBoundary'
import ContextProviders from 'generic/ContextProviders'
import Routes from 'generic/Routes'

const App: React.FunctionComponent = (): JSX.Element =>
  <Fragment>
    <CssBaseline />
    <CustomTheme>
      <Grid container justify='center' style={{ marginTop: 60 }}>
        <Grid item xs={11}>
          <ErrorBoundary>
            <ContextProviders>
              <Routes />
            </ContextProviders>
          </ErrorBoundary>
        </Grid>
      </Grid>
    </CustomTheme>
  </Fragment>

export default App
