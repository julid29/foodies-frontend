import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import validator from 'validator';

// Material Components
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { FormControl, FormLabel, Input, InputLabel, FormHelperText, Button } from '@material-ui/core';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import CircularProgress from '@material-ui/core/CircularProgress';
import TextField from '@material-ui/core/TextField';

// Custom Libraries
import AuthService from '../services';
import { checkData } from '../services/authService'


class Register extends Component {

  constructor() {
    super();
    
    document.title = 'Registro | Foodies';

    this.state = {
      loading: false,
      activeStep: 0,
      skipped: new Set(),
      objetive: '',
      name: '',
      lastname: '',
      email: '',
      email_confirmation: '',
      password: '',
      password_confirmation: '',
      errors: {},
      response: {
        error: false,
        message: '',
      },
      success: false,
    };

    this.isStepOptional = step => {
      return false;
    };  

    this.handleNext = () => {
      const { activeStep } = this.state;
      let { skipped } = this.state;
      if (this.isStepSkipped(activeStep)) {
        skipped = new Set(skipped.values());
        skipped.delete(activeStep);
      }
      this.setState({
        activeStep: activeStep + 1,
        skipped,
      });
    };

    this.handleBack = () => {
      this.setState(state => ({
        activeStep: state.activeStep - 1,
      }));
    };

    this.handleSkip = () => {
      const { activeStep } = this.state;
      if (!this.isStepOptional(activeStep)) {
        // You probably want to guard against something like this,
        // it should never occur unless someone's actively trying to break something.
        throw new Error("No puedes saltearte un paso obligatorio.");
      }
  
      this.setState(state => {
        const skipped = new Set(state.skipped.values());
        skipped.add(activeStep);
        return {
          activeStep: state.activeStep + 1,
          skipped,
        };
      });
    };

    this.handleReset = () => {
      this.setState({
        activeStep: 0,
      });
    };

    this.isStepSkipped = step => {
      return false;
    };

    this.allFieldsCompleted = step => {
      if (this.state.objetive.length <= 0 || this.state.name.length <= 0 || this.state.lastname.length <= 0 ||
        this.state.email.length <= 0 || this.state.email_confirmation.length <= 0 ||
        this.state.password.length <= 0 || this.state.password_confirmation.length <= 0) {
          return true;
        } else {
          return false;
        }
    }

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

    if ('name' === field && false === validator.isLength(value, {min:4})) {
      errors.name = 'El nombre debe tener al menos 4 caracteres';
      this.setState(errors);
      return;
    }

    if ('email' === field && false === validator.isEmail(value)) {
      errors.email = 'El mail debe ser una direccion valida.';
      this.setState(errors);
      return;
    }

    // if ('email' === field) {
    //   this.props.dispatch(checkData(this.state.userType, 'checkEmail', value))
    //     .then((response) => {
    //       if (!response) {
    //         errors.email = 'El mail ya esta en uso';
    //         this.setState(errors);
    //         return;
    //       }
    //     })
    // }

    if ('email_confirmation' === field ) {
      const email = this.state.email;
      if (email && value !== email) {
        errors.email_confirmation = 'Los emails deben ser iguales.';
        this.setState(errors);
        return;
      }
    }

    if ('password' === field && false === validator.isLength(value, {min:6})) {
      errors.password = 'La contraseña debe tener al menos 6 caracteres.';
      this.setState(errors);
      return;
    }
    
    if ('password_confirmation' === field ) {
      const password = this.state.password;
      if (password && value !== password) {
        errors.password_confirmation = 'Las contraseñas deben coincidir.';
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
    const { objetive, name, lastname, email, password, errors} = this.state;
    const registerData = {
      "objetivo": objetive,
      "nombre": name + " " + lastname,
      "password": password,
      "email": email
    };

    // Set response state back to default.
    this.setState({ response: { error: false, message: '' }});
    
    if (! Object.keys(errors).length) {
      this.setState({ loading: true });
      this.submit(registerData);
    }
  }

  submit(registerData) {
    this.props.dispatch(AuthService.register(registerData))
      .then(() => {
        this.registrationForm.reset();
        this.setState({ loading: false, success: true });
      })
      .catch((err) => {
        console.log(err);
        const errors = Object.values(err.error);
        const response = {
          error: true,
          message: errors,
        };
        this.setState({ response });
        this.setState({ loading: false });
      });
  }

  render() {
    // If user is authenticated we redirect to Dashboard.
    if (this.props.isAuthenticated && this.props.user) {
      return <Redirect to="/" replace />;
    }

    const { classes } = this.props;
    const { response, errors, loading } = this.state;

    return (
      <Paper className={classes.slimActionForm} elevation={1}>
        <Typography variant="headline" align="center" component="h3">
          Registrate en Foodies
        </Typography>

        {response.error &&
          <Typography variant="subheading" align="center" color="secondary">
            {response.message}
          </Typography>
        }

        {this.state.success &&
          <Typography variant="subheading" align="center">
            Registración exitosa
            <br />
            <Link to="/">Por favor, logeate con tu email y contraseña</Link>
            <br /><br />
          </Typography>
        }

        {!this.state.success &&
        <form className={classes.form} onSubmit={this.handleSubmit} ref={(el) => { this.registrationForm = el; }}>
          <FormControl component="fieldset">
            <FormLabel component="legend">Elegi tu Objetivo</FormLabel>
            <RadioGroup
              aria-label="Objetivo"
              name="objetive"
              value={this.state.objetive}
              onChange={this.handleChange}
            >
              <FormControlLabel value="adelgazar" control={<Radio />} label="Bajar de peso" />
              <FormControlLabel value="crecer" control={<Radio />} label="Subir de peso" />
            </RadioGroup>
          </FormControl>
          <FormControl margin="normal" required fullWidth>
            <InputLabel>Nombre</InputLabel>
            <Input
              id="name"
              name="name"
              autoComplete="name"
              onChange={this.handleChange}
              onBlur={this.handleBlur}
              autoFocus
              disabled={loading}
            />
            {('name' in errors) &&
            <FormHelperText error={true}>{errors.name}</FormHelperText>
            }
          </FormControl>
          <FormControl margin="normal" required fullWidth>
            <InputLabel>Apellido</InputLabel>
            <Input
              id="lastname"
              name="lastname"
              autoComplete="lastname"
              
              onChange={this.handleChange}
              onBlur={this.handleBlur}
              error={('lastname' in errors)}
              autoFocus
              disabled={loading}
            />
            {('lastname' in errors) &&
            <FormHelperText error={true}>{errors.lastname}</FormHelperText>
            }
          </FormControl>
          <FormControl margin="normal" required fullWidth>
            <InputLabel>Email</InputLabel>
            <Input
              id="email"
              name="email"
              autoComplete="email"
              onChange={this.handleChange}
              onBlur={this.handleBlur}
              error={('email' in errors)}
              disabled={loading}
            />
            { ('email' in errors) &&
            <FormHelperText error={true}>{errors.email}</FormHelperText>
            }
          </FormControl>
          <FormControl margin="normal" required fullWidth>
            <InputLabel>Confirmar Email</InputLabel>
            <Input
              id="email_confirmation"
              name="email_confirmation"
              autoComplete="email_confirmation"
              
              onChange={this.handleChange}
              onBlur={this.handleBlur}
              error={('email_confirmation' in errors)}
              disabled={loading}
            />
            { ('email_confirmation' in errors) &&
            <FormHelperText error={true}>{errors.email_confirmation}</FormHelperText>
            }
          </FormControl>
          <FormControl margin="normal" required fullWidth>
            <InputLabel>Contraseña</InputLabel>
            <Input
              id="password"
              name="password"
              autoComplete="password"
              
              onChange={this.handleChange}
              onBlur={this.handleBlur}
              error={('password' in errors)}
              disabled={loading}
              type="password"
            />
            { ('password' in errors) &&
            <FormHelperText error={true}>{errors.password}</FormHelperText>
            }
          </FormControl>
          <FormControl margin="normal" required fullWidth>
            <InputLabel>Confirmar Contraseña</InputLabel>
            <Input
              id="password_confirmation"
              name="password_confirmation"
              autoComplete="password_confirmation"
              
              onChange={this.handleChange}
              onBlur={this.handleBlur}
              error={('password_confirmation' in errors)}
              disabled={loading}
              type="password"
            />
            { ('password_confirmation' in errors) &&
            <FormHelperText error={true}>{errors.password_confirmation}</FormHelperText>
            }
          </FormControl>
          <Button
            type="submit"
            fullWidth
            variant="raised"
            color="primary"
            disabled={loading}
            className={classes.submit}
          >
            {loading ? <CircularProgress size={16} className={classes.buttonProgress} /> : 'Registrate'}
          </Button>
        </form>
        }

      </Paper>
    );
  }
}

Register.propTypes = {
  classes: PropTypes.object.isRequired,
};

const styles = theme => ({
  slimActionForm: {
    ...theme.mixins.gutters(),
    formControl: {
      margin: theme.spacing.unit * 3,
    },
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
  user: state.Auth.user,
});

export default connect(mapStateToProps)(withStyles(styles)(Register));