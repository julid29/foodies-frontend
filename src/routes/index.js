import React from 'react';
import { BrowserRouter as Router, Switch } from 'react-router-dom';
import routes from './routes';
import PublicRoute from './Public';
import PrivateRoute from './Private';
import SplitRoute from './Split';

const Routes = () => (
  <Router>
    <Switch>
      {routes.map((route, i) => {
        if (route.auth && route.fallback) {
          return <SplitRoute key={i} {...route} />;
        } else if (route.auth) {
          return <PrivateRoute key={i} {...route} />;
        }
        return <PublicRoute key={i} {...route} />;
      })}
    </Switch>
  </Router>
);

export default Routes;
