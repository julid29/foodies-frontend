import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import validator from 'validator';

// Material Components
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import {FormControl, Input, InputLabel, FormHelperText, Button} from '@material-ui/core';

// Custom Libraries
import AuthService from '../services';

class Login extends Component {

  constructor() {
    super();
    
    document.title = 'Login | Foodies';

    this.state = {
      loading: false,
      email: '',
      password: '',
      errors: {},
      response: {
        error: false,
        message: '',
      },
    };
    
    this.handleChange = this.handleChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    const { name, value } = e.target;
    this.setState({ [name]: value });
    
    // If a field has a validation error, we'll clear it if corrected.
    const { errors } = this.state;
    if (name in errors) {
      this.validate(name, value);
    }
  }

  handleBlur(e) {
    const { name, value } = e.target;
    
    // Avoid validation until input has a value.
    if (value === '') {
      return;
    }
    
    this.validate(name, value);
  }
  
  validate(field, value) {
    
    let errors = this.state.errors;

    if ('email' === field && value.indexOf('@') !== -1 && false === validator.isEmail(value)) {
      errors.email = 'Debes ingresar un mail valido';
      this.setState(errors);
      return;
    }
    
    if ('password' === field && false === validator.isLength(value, {min:6})) {
      errors.password = 'Debes ingresar tu contraseña';
      this.setState(errors);
      return;
    }
    
    // Validation passed.
    // Remove field from {errors} if present.
    if (field in errors) {
      delete errors[field];
      this.setState(errors);
    }
  }
  
  handleSubmit(e) {
    e.preventDefault();
    const { email, password, errors } = this.state;
    const credentials = {
      email,
      password,
    };

    // Set response state back to default.
    this.setState({ response: { error: false, message: '' } });
    
    if (! Object.keys(errors).length) {
      this.setState({ loading: true });
      this.submit(credentials);
    }
  }

  submit(credentials) {
    this.props.dispatch(AuthService.login(credentials))
      .catch((err) => {
        this.loginForm.reset();
        const response = {
          error: true,
          message: err.errors[0],
        };
        this.setState({ response });
        this.setState({ loading: false });
      });
  }

  render() {
    
    // If user is already authenticated we redirect to entry location.
    const { from } = this.props.location.state || { from: { pathname: '/' } };
    const { isAuthenticated } = this.props;
    if (isAuthenticated) {
      return (
        <Redirect to={from} />
      );
    }

    const { classes } = this.props;
    const { response, errors, loading } = this.state;

    return (
      <div>
        <Paper className={classes.slimActionForm} elevation={1}>
          <Typography variant="headline" align="center" component="h3">
            Inicia sesion en Foodies
          </Typography>

          {response.error &&
          <Typography variant="subheading" align="center" color="secondary">
            {response.message}
          </Typography>
          }

          <form className={classes.form} onSubmit={this.handleSubmit} ref={el => { this.loginForm = el; }}>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="email">Email</InputLabel>
              <Input
                id="email"
                name="email"
                autoComplete="email"
                onChange={this.handleChange}
                onBlur={this.handleBlur}
                error={('email' in errors)}
                autoFocus
              />
              { ('email' in errors) &&
              <FormHelperText error={true}>{errors.email}</FormHelperText>
              }
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="password">Contraseña</InputLabel>
              <Input
                name="password"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={this.handleChange}
                onBlur={this.handleBlur}
                error={('password' in errors)}
              />
              { ('password' in errors) &&
              <FormHelperText error={true}>{errors.password}</FormHelperText>
              }
            </FormControl>
            <Button
              type="submit"
              fullWidth
              variant="raised"
              color="primary"
              className={classes.submit}
            >
              Iniciar Sesion
            </Button>
          </form>
        </Paper>
        
        <Typography align="center" component="p" className={classes.passwordLink}>
          <Link to="/forgot-password">Olvidaste tu contraseña?</Link>
        </Typography>
      </div>
    );
  }
}

Login.propTypes = {
  classes: PropTypes.object.isRequired,
};

const styles = theme => ({
  slimActionForm: {
    ...theme.mixins.gutters(),
    padding: theme.spacing.unit * 4,
    marginTop: theme.spacing.unit * 5,
    marginRight: theme.spacing.unit * 2,
    marginLeft: theme.spacing.unit * 2,
    [theme.breakpoints.up(640 + theme.spacing.unit * 3 * 2)]: {
      width: 640,
      marginTop: theme.spacing.unit * 10,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  submit: {
    marginTop: theme.spacing.unit * 2
  },
  passwordLink: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2
  }
});

const mapStateToProps = state => ({
  isAuthenticated: state.Auth.isAuthenticated,
});

export default connect(mapStateToProps)(withStyles(styles)(Login));