import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import AvalancheTest from './avalanche-test';
import AvalancheTestDetail from './avalanche-test-detail';
import AvalancheTestUpdate from './avalanche-test-update';
import AvalancheTestDeleteDialog from './avalanche-test-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={AvalancheTestUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={AvalancheTestUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={AvalancheTestDetail} />
      <ErrorBoundaryRoute path={match.url} component={AvalancheTest} />
    </Switch>
    <ErrorBoundaryRoute path={`${match.url}/:id/delete`} component={AvalancheTestDeleteDialog} />
  </>
);

export default Routes;
