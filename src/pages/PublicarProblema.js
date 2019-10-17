import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import validator from 'validator';

// Material Components
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { FormControl, Input, InputLabel, FormHelperText, Button, TextField, Select, MenuItem } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';

// Custom Libraries
import { publicar, obtenerProfesiones } from '../services/dataService';


class PublicarProblema extends Component {
  constructor(props) {
    super(props);

    document.title = 'Subir Receta | Foodies';

    this.state = {
      user: props.user,
      loading: false,
      problemTitle: '',
      problemDescription: '',
      problemImages: [],
      presupuestoMaximo: 0,
      presupuestoMinimo: 0,
      problemType: '',
      problemZone: '',
      errors: {},
      response: {
        error: false,
        message: '',
      },
      success: false,
      rubros: []
    };
  }

  componentWillMount() {
    this.props.dispatch(obtenerProfesiones())
      .then((response) => {
        this.setState({ rubros: response });
      }).catch((err) => {
        const response = {
          error: true,
          message: err.data,
        };
        this.setState({ response });
        this.setState({ loading: false });
      });
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });

    // If a field has a validation error, we'll clear it if corrected.
    const { errors } = this.state;
    if (name in errors) {
      this.validate(name, value);
    }
  }

  handleBlur = (e) => {
    const { name, value } = e.target;

    // Avoid validation until input has a value.
    if (value === '') {
      return;
    }

    this.validate(name, value);
  }

  validate(field, value) {
    const { errors } = this.state;

    if (field === 'firstName' && validator.isLength(value, { min: 3 }) === false) {
      errors.name = 'The name field must be at least 3 characters.';
      this.setState(errors);
      return;
    }

    if (field === 'lastName' && validator.isLength(value, { min: 3 }) === false) {
      errors.name = 'The name field must be at least 3 characters.';
      this.setState(errors);
      return;
    }

    if (field === 'email' && validator.isEmail(value) === false) {
      errors.email = 'The email field must be a valid email.';
      this.setState(errors);
      return;
    }

    if (field === 'password' && validator.isLength(value, { min: 6 }) === false) {
      errors.password = 'The password field must be at least 6 characters.';
      this.setState(errors);
      return;
    }

    if (field === 'password_confirmation') {
      const { password } = this.state;
      if (password && value !== password) {
        errors.password_confirmation = 'Password fields must match.';
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

  handleSubmit = (e) => {
    e.preventDefault();
    const {user, problemTitle, problemDescription, presupuestoMaximo, presupuestoMinimo, problemType, problemZone, errors} = this.state;
    const problemaData = {
      "idCliente": user.idCliente,
      "titulo": problemTitle,
      "descripcion": problemDescription,
      "presupuestoMinimo": presupuestoMinimo,
      "presupuestoMaximo": presupuestoMaximo,
      "zona": problemZone,
      "idRubro": problemType,
    };

    // Set response state back to default.
    this.setState({ response: { error: false, message: '' } });

    if (!Object.keys(errors).length) {
      this.setState({ loading: true });
      this.submit(problemaData);
    }
  }

  submit(problemaData) {
    this.props.dispatch(publicar(problemaData))
      .then(() => {
        this.setState({ loading: false, success: true });
      })
      .catch((err) => {
        console.log(err);
        const errors = Object.values(err.errors);
        const messages = errors.map(m => Object.values(m)[0]);
        messages.join(' ');
        const response = {
          error: true,
          message: messages,
        };
        this.setState({ response });
        this.setState({ loading: false });
      });
  }

  render() {
    // If user is authenticated we redirect to Dashboard.
    if (!this.props.isAuthenticated || !this.props.user) {
      return <Redirect to="/" replace />;
    }

    const { classes } = this.props;
    const { response, errors, loading } = this.state;

    return (
      <Paper className={classes.slimActionForm} elevation={1}>
        <Typography variant="headline" align="center" component="h3">
          Publica tu Problema
        </Typography>

        {!this.state.success &&
          <Typography variant="subheading" align="center" component="h3">
            Selecciona el rubro, titula y detalla tu problema, ingresa un rango presupuestario y la zona del problema. 
          </Typography>
        }

        {response.error &&
          <Typography variant="subheading" align="center" color="secondary">
            {response.message}
          </Typography>
        }

        {this.state.success &&
          <Typography variant="subheading" align="center">
            <br/>Publicación de problema exitosa.<br />
            Analizaremos el mismo y en breve los Fixers podran verlo.<br />
            <Link to="/">Vuelve al Dashboard</Link>
          </Typography>
        }

        {!this.state.success &&
        <form className={classes.form} onSubmit={this.handleSubmit}>
          <FormControl margin="normal" required fullWidth>
            <InputLabel htmlFor="problemType">Rubro</InputLabel>
            <Select
              id="problemType"
              name="problemType"
              value={this.state.problemType}
              onChange={this.handleChange}
            >
              {this.state.rubros.map((rubro, index) => {
                return (
                  <MenuItem value={rubro.idRubro}>{rubro.descripcion}</MenuItem>
                );})}
            </Select>
            {('problemType' in errors) &&
            <FormHelperText error>{errors.name}</FormHelperText>
            }
          </FormControl>
          <FormControl margin="normal" required fullWidth>
            <InputLabel htmlFor="problemTitle">Titulo</InputLabel>
            <Input
              id="problemTitle"
              name="problemTitle"
              onChange={this.handleChange}
              onBlur={this.handleBlur}
              error={('problemTitle' in errors)}
              autoFocus
              disabled={loading}
            />
            {('problemTitle' in errors) &&
            <FormHelperText error>{errors.name}</FormHelperText>
            }
          </FormControl>
          <FormControl margin="normal" required fullWidth>
            <TextField
              id="problemDescription"
              name="problemDescription"
              label="Comenta tu problema, se preciso"
              multiline
              onChange={this.handleChange}
              margin="normal"
              onBlur={this.handleBlur}
              error={('problemDescription' in errors)}
              disabled={loading}
            />
            {('problemDescription' in errors) &&
            <FormHelperText error>{errors.name}</FormHelperText>
            }
          </FormControl>
          <br/><br/>
          <InputLabel>Ingresa tu rango presupuestario</InputLabel>
          <FormControl margin="normal" required fullWidth>
            <InputLabel htmlFor="presupuestoMinimo">Desde</InputLabel>
            <Input
              id="presupuestoMinimo"
              name="presupuestoMinimo"
              type="number"
              onChange={this.handleChange}
              onBlur={this.handleBlur}
              error={('presupuestoMinimo' in errors)}
              disabled={loading}
            />
            { ('presupuestoMinimo' in errors) &&
            <FormHelperText error>{errors.email}</FormHelperText>
            }
          </FormControl>
          <FormControl margin="normal" required fullWidth>
            <InputLabel htmlFor="presupuestoMaximo">hasta</InputLabel>
            <Input
              id="presupuestoMaximo"
              name="presupuestoMaximo"
              type="number"
              onChange={this.handleChange}
              onBlur={this.handleBlur}
              error={('presupuestoMaximo' in errors)}
              disabled={loading}
            />
            { ('presupuestoMaximo' in errors) &&
            <FormHelperText error>{errors.email}</FormHelperText>
            }
          </FormControl>
          <FormControl margin="normal" required fullWidth>
            <InputLabel htmlFor="problemZone">Zona del Problema</InputLabel>
            <Input
              id="problemZone"
              name="problemZone"
              onChange={this.handleChange}
              onBlur={this.handleBlur}
              error={('problemZone' in errors)}
              autoFocus
              disabled={loading}
            />
            {('problemZone' in errors) &&
            <FormHelperText error>{errors.name}</FormHelperText>
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
            {loading ? <CircularProgress size={16} className={classes.buttonProgress} /> : 'Publicar'}
          </Button>
        </form>
        }

      </Paper>
    );
  }
}

const styles = theme => ({
  slimActionForm: {
    ...theme.mixins.gutters(),
    padding: theme.spacing.unit * 4,
    marginTop: theme.spacing.unit * 5,
    marginRight: theme.spacing.unit * 2,
    marginLeft: theme.spacing.unit * 2,
    [theme.breakpoints.up(640 + (theme.spacing.unit * 3 * 2))]: {
      width: 640,
      marginTop: theme.spacing.unit * 10,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  submit: {
    marginTop: theme.spacing.unit * 2,
    position: 'relative',
  },
  buttonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -8,
    marginLeft: -8,
  },
});

PublicarProblema.propTypes = {
  classes: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  isAuthenticated: state.Auth.isAuthenticated,
  user: state.Auth.user,
});

export default connect(mapStateToProps)(withStyles(styles)(PublicarProblema));
