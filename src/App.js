import React, { Component } from 'react';
import { connect } from 'react-redux';

// Material Components
import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

// Custom Libraries
import NavBar from './components/NavBar.js';

class App extends Component {

  constructor() {
    super();
  }

  render() {
    const { classes } = this.props;

    return(
    <div className={classes.page}>
      <CssBaseline />
      <NavBar />
      <main className={classes.layout}>
        {this.props.children}
      </main>
    </div>
    )
  }
}

const styles = theme => ({
  page: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column'
  },
  layout: {
    maxWidth: 1140,
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    paddingTop: theme.spacing.unit * 6,
    paddingBottom: theme.spacing.unit * 6,
    flex: 1,
    [theme.breakpoints.up(1140 + theme.spacing.unit * 3 * 2)]: {
      width: 1140,
      marginLeft: 'auto',
      marginRight: 'auto',
      display: 'flex',
      flexDirection: 'column'
    },
  }
});

const mapStateToProps = state => ({
  isAuthenticated: state.Auth.isAuthenticated,
});

export default connect(mapStateToProps)(withStyles(styles)(App));
