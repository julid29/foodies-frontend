import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Routes from './routes';
import store from './store';
import * as action from './store/actions';
import './index.css';

// Check if user is authenticated.
store.dispatch(action.authCheck());

// Global theme overrides.
const theme = createMuiTheme({
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
  },
  palette: {
    primary: {
      main: '#0069d9',
    }
  },
});

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <Switch>
        <MuiThemeProvider theme={theme}>
          <Routes />
        </MuiThemeProvider>
      </Switch>
    </Router>
  </Provider>,
  document.getElementById('root'),
);
