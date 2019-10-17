import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import * as actions from '../store/actions';
import salad from './resources/fat.png';

class MenuAppBar extends Component {
  
  constructor(props) {
    super(props);
    
    this.state = {
      anchorEl: null
    };

    this.handleLogout = this.handleLogout.bind(this);
  }

  handleMenu = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };
  
  handleLogout(e) {
    e.preventDefault();
    this.props.dispatch(actions.authLogout());
  }

  render() {
    const { classes } = this.props;
    const { anchorEl, user } = this.state;
    const open = Boolean(anchorEl);

    return (
      <AppBar position="static">
        <Toolbar>
          <div className={classes.flex}>
            <Link to="/" className={classes.logoLink}>
            <div className={classes.logo}>
              <img src={salad} width="28" height="28" alt=""></img>
            </div>
            <Typography variant="title" color="inherit">
              Foodies
            </Typography>
            </Link>
          </div>
          {this.props.isAuthenticated && (
            <div>
              <IconButton
                aria-owns={open ? 'menu-appbar' : null}
                aria-haspopup="true"
                onClick={this.handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={open}
                onClose={this.handleClose}
              >
                <MenuItem>
                  <Link  style={{ textDecoration: 'none' }} to="/profile">Perfil</Link>
                </MenuItem>
                {this.props.user.userType === 'fixer' &&
                  <MenuItem>
                    <Link  style={{ textDecoration: 'none' }} to="/professions">Manejar Profesiones</Link>
                  </MenuItem>
                }
                <MenuItem onClick={this.handleLogout}>Salir</MenuItem>
              </Menu>
            </div>
          )}
        </Toolbar>
      </AppBar>
    );
  }
}

MenuAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  isAuthenticated: state.Auth.isAuthenticated,
  user: state.Auth.user,
});

const styles = theme => ({
  flex: {
    flex: 1,
  },
  logoLink: {
    color: '#fff',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center'
  },
  logo: {
    marginRight: theme.spacing.unit * 2
  }
});

export default connect(mapStateToProps)(withStyles(styles)(MenuAppBar));