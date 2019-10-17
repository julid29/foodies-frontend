import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
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


class ForgotPassword extends Component {

  constructor() {
    super();
    
    document.title = 'Recuperar Contraseña | Foodies';

    this.state = {
      loading: false,
      email: '',
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

    if ('email' === field && false === validator.isEmail(value)) {
      errors.email = 'The email field must be a valid email.';
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
    const credentials = { email };

    // Set response state back to default.
    this.setState({ response: { error: false, message: '' } });
    
    if (! Object.keys(errors).length) {
      this.setState({ loading: true });
      this.submit(credentials);
    }
  }

  submit(credentials) {
    this.props.dispatch(AuthService.resetPassword(credentials))
    .then((res) => {
      this.forgotPasswordForm.reset();
      const response = {
        error: false,
        message: res.message,
      };
      this.setState({ loading: false, success: true, response });
    })
    .catch((err) => {
      this.forgotPasswordForm.reset();
      const errors = Object.values(err.errors);
      errors.join(' ');
      const response = {
        error: true,
        message: errors,
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
      <Paper className={classes.slimActionForm} elevation={1}>
        <Typography variant="headline" align="center" component="h3">
          Solicitar reseteo de Contraseña
        </Typography>
        
        {this.state.success &&
          <Typography variant="subheading" align="center">
            Un link de para resetear tu contraseña te ha sido enviado!
          </Typography>
        }

        { response.error &&
          <Typography variant="subheading" align="center" color="secondary">
            { response.message }
          </Typography>
        }

        {!this.state.success &&
        <form className={classes.form} onSubmit={this.handleSubmit} ref={el => { this.forgotPasswordForm = el; }}>
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
          <Button
            type="submit"
            fullWidth
            variant="raised"
            color="primary"
            className={classes.submit}
          >
            Solicitar reseteo
          </Button>
        </form>
        }

      </Paper>
    );
  }
}

ForgotPassword.propTypes = {
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
  }
});

const mapStateToProps = state => ({
  isAuthenticated: state.Auth.isAuthenticated,
});

export default connect(mapStateToProps)(withStyles(styles)(ForgotPassword));