import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import validator from 'validator';

// Material Components
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import {FormControl, Input, InputLabel, FormHelperText, Button} from '@material-ui/core';

// Custom Libraries
import AuthService from '../services';


class ResetPassword extends Component {

  constructor(props) {
    super(props);
    
    document.title = 'Recuperar Contraseña | Foodies';

    this.state = {
      loading: false,
      id: this.getResetId(),
      token: this.getResetToken(),
      password: '',
      password_confirmation: '',
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
  
  getResetId() {
    const params = new URLSearchParams(this.props.location.search);
    if (params.has('id')) {
      return params.get('id');
    }
    return '';
  }

  getResetToken() {
    const params = new URLSearchParams(this.props.location.search);
    if (params.has('token')) {
      return params.get('token');
    }
    return '';
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
    
    if ('password' === field && false === validator.isLength(value, {min:6})) {
      errors.password = 'La contraseña debe tener al menos 6 caracteres';
      this.setState(errors);
      return;
    }
    
    if ('password_confirmation' === field ) {
      const password = this.state.password;
      if (password && value !== password) {
        errors.password_confirmation = 'Los campos deben ser identicos';
        this.setState(errors);
        return;
      }
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
    const credentials = {
      id: this.state.id,
      token: this.state.token,
      password: this.state.password,
      password_confirmation: this.state.password_confirmation,
    };
    
    if (! Object.keys(this.state.errors).length) {
      this.setState({ loading: true });
      this.submit(credentials);
    }
  }

  submit(credentials) {
    this.props.dispatch(AuthService.updatePassword(credentials))
      .then((res) => {
        this.passwordResetForm.reset();
        const response = {
          error: false,
          message: res.message,
        };
        this.setState({ loading: false, success: true, response });
      })
      .catch((err) => {
        this.passwordResetForm.reset();
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
          Reseteo de Contraseña
        </Typography>
        
        {this.state.success &&
          <Typography variant="subheading" align="center">
            Tu contraseña ha sido reseteada!
          </Typography>
        }

        { response.error &&
          <Typography variant="subheading" align="center" color="secondary">
            { response.message }
          </Typography>
        }

        {!this.state.success &&
        <form className={classes.form} onSubmit={this.handleSubmit} ref={el => { this.passwordResetForm = el; }}>
          <FormControl margin="normal" required fullWidth>
            <InputLabel htmlFor="password">Contraseña</InputLabel>
            <Input
              name="password"
              type="password"
              id="password"
              onChange={this.handleChange}
              onBlur={this.handleBlur}
              error={('password' in errors)}
            />
            { ('password' in errors) &&
            <FormHelperText error={true}>{errors.password}</FormHelperText>
            }
          </FormControl>
          <FormControl margin="normal" required fullWidth>
            <InputLabel htmlFor="password_confirmation">Re-ingresar contraseña</InputLabel>
            <Input
              name="password_confirmation"
              type="password"
              id="password_confirmation"
              onChange={this.handleChange}
              onBlur={this.handleBlur}
              error={('password_confirmation' in errors)}
              disabled={loading}
            />
            { ('password' in errors) &&
            <FormHelperText error={true}>{errors.password_confirmation}</FormHelperText>
            }
          </FormControl>
          <Button
            type="submit"
            fullWidth
            variant="raised"
            color="primary"
            className={classes.submit}
          >
            Resetear
          </Button>
        </form>
        }

      </Paper>
    );
  }
}

ResetPassword.propTypes = {
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

export default connect(mapStateToProps)(withStyles(styles)(ResetPassword));