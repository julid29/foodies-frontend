import React from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router';
import App from '../App';

const PublicRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props => (
      <App>
        <Component {...props} />
      </App>
    )}
  />
);

PublicRoute.propTypes = {
};

export default PublicRoute;
