import React from 'react'
import { Switch, Route } from 'react-router-dom'

import Index from 'components/Index'
import Sign from 'components/Sign'
import NotFound from 'components/generic/NotFound'

const Routes: React.FunctionComponent = (): JSX.Element =>
  <Switch>
    <Route exact path='/' component={Index} />
    <Route exact path='/sign' component={Sign} />
    <Route component={NotFound} />
  </Switch>

export default Routes
