import React, { Component } from 'react';
import { connect } from 'react-redux';
import { agregarProfesionAProfesional, obtenerProfesiones, obtenerProfesionesDeProfesional, quitarProfesionAProfesional} from '../services/dataService';

// Material Components
import { withStyles } from '@material-ui/core/styles/';

// Custom Libraries
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Switch from '@material-ui/core/Switch';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'


// @TODO Would prefer to inline if possible.
import '../css/mood.css';

class Profesiones extends Component {
  constructor(props) {
    super(props);

    // Initial state.
    this.state = {
      user: props.user,
      selected: '',
      message: '',
      data_id: false,
      profesiones: [],
      userProfesiones: [],
      open: false,
      matricula: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.agregarProfesion = this.agregarProfesion.bind(this);
  }
  
  componentWillMount() {
    this.props.dispatch(obtenerProfesiones())
      .then((response) => {
        this.setState({ profesiones: response });
        this.props.dispatch(obtenerProfesionesDeProfesional(this.state.user.idProfesional))
        .then((response) => {
          this.setState({ userProfesiones: response });
        }).catch((err) => {
          const response = {
            error: true,
            message: err.data,
          };
          this.setState({ response });
          this.setState({ loading: false });
        });
      }).catch((err) => {
        const response = {
          error: true,
          message: err.data,
        };
        this.setState({ response });
        this.setState({ loading: false });
      });
  }

  handleToggle = idRubro => event => {
    if (event.target.checked === false) {
      this.props.dispatch(quitarProfesionAProfesional(this.state.user.idProfesional, idRubro))
      .then((response) => window.location.reload())
      .catch((err) => {
        const response = {
          error: true,
          message: err.data,
        };
        this.setState({ response });
        this.setState({ loading: false });
      });
    } else {
      this.setState({ open: true });
      this.setState({ idRubroAgregar: idRubro})
    }
  }

  agregarProfesion(e) {
    this.props.dispatch(agregarProfesionAProfesional(this.state.user.idProfesional, this.state.idRubroAgregar, this.state.matricula))
    .then((response) => window.location.reload())
    .catch((err) => {
      const response = {
        error: true,
        message: err.data,
      };
      this.setState({ response });
      this.setState({ loading: false });
    });
  }

  findWithAttr(array, attr, value) {
    if (array) {
      for(var i = 0; i < array.length; i += 1) {
          if(array[i][attr] === value) {
              return true;
          }
      }
      return false;
    } else {
      return false;
    }
  }

  findWithAttr2(array, attr, value) {
    for(var i = 0; i < array.length; i += 1) {
        if(array[i][attr] === value) {
            return array[i]["matricula"];
        }
    }
    return "";
  }

  hasMatricula(array, attr, value) {
    const matricula = this.findWithAttr2(array, attr, value)

    if (matricula !== "") {
      return "Matricula: " + matricula
    }
  }

  handleClose = () => {
    this.setState({ open: false });
  }

  handleChange(e) {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  render() {
    const { classes } = this.props;
    const { profesiones, userProfesiones, matricula } = this.state;

    return (
      <main className={classes.layout}>
        <List subheader={<ListSubheader>Profesiones Habilitadas</ListSubheader>} className={classes.root}>
          {profesiones.length > 0 && profesiones.map((profesion, index) => {
            return (
              <ListItem>
                <ListItemText primary={profesion.descripcion} />
                {userProfesiones &&
                  <ListItemText primary={this.hasMatricula(userProfesiones, 'idRubro', profesion.idRubro)} />
                }
                <ListItemSecondaryAction>
                  <Switch
                    onChange={this.handleToggle(profesion.idRubro)}
                    checked={this.findWithAttr(userProfesiones, 'idRubro', profesion.idRubro)}
                  />
                </ListItemSecondaryAction>
              </ListItem>
            );
          })}
        </List>
        <Dialog open={this.state.open} onClose={this.handleClose} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">Matrícula</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Si la profesion requiere de una matrícula certificada ingresala por favor, sino deje el 
              casillero en blanco
            </DialogContentText>
            <TextField autoFocus margin="dense" name="matricula" label="Matrícula" type="text" value={matricula} onChange={this.handleChange} fullWidth />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Cancelar
            </Button>
            <Button onClick={this.agregarProfesion} color="primary">
              Aceptar
            </Button>
          </DialogActions>
        </Dialog>
      </main>
    );

  }

}

const styles = theme => ({
  pageTitle: {
    marginBottom: theme.spacing.unit * 6,
  },
  actionForm: {
    ...theme.mixins.gutters(),
    padding: theme.spacing.unit * 4,
    marginTop: theme.spacing.unit * 5,
    marginRight: theme.spacing.unit * 2,
    marginLeft: theme.spacing.unit * 2,
    [theme.breakpoints.up(880 + theme.spacing.unit * 3 * 2)]: {
      width: 880,
      marginTop: theme.spacing.unit * 10,
      marginLeft: 'auto',
      marginRight: 'auto',
    }
  }
});

const mapStateToProps = state => ({
  isAuthenticated: state.Auth.isAuthenticated,
  user: state.Auth.user
});

export default connect(mapStateToProps)(withStyles(styles)(Profesiones));