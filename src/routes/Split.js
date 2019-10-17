import React from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router';
import { connect } from 'react-redux';
import App from '../App';

const SplitRoute = ({
  component: Component, fallback: Fallback, isAuthenticated, ...rest
}) => (
  <Route
    {...rest}
    render={props => (
        isAuthenticated ? (
          <App>
            <Component {...props} />
          </App>
        ) : (
          <App>
            <Fallback {...props} />
          </App>
        )
    )}
  />
);

SplitRoute.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
};


const mapStateToProps = state => ({
  isAuthenticated: state.Auth.isAuthenticated,
});

export default connect(mapStateToProps)(SplitRoute);
