import React, { Component } from 'react';
import { connect } from 'react-redux';

import { cerrarProblema, aceptarLicitacion, obtenerProblema, obtenerPresupuestosDeProblema, valorar } from '../services/dataService';

// Material Components
import { withStyles } from '@material-ui/core/styles/';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

// Custom Libraries
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Chip from '@material-ui/core/Chip';
import DoneIcon from '@material-ui/icons/Done';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField'

// @TODO Would prefer to inline if possible.
import '../css/mood.css';

class Problema extends Component {
  
  constructor(props) {
    super(props);

    // Initial state.
    this.state = {
      user: props.user,
      problemId: this.props.match.params.id,
      problemData: null,
      presupuestos: [],
      presupuestoAceptado: null,
      trabajo: null,
      estadosTrabajo: [
        {key: 'A', value: 'En curso', color: 'primary', icon: ''},
        {key: 'B', value: 'Cerrado por Cliente', color: 'primary', icon: ''},
        {key: 'C', value: 'Cerrado por Fixer', color: 'primary', icon: ''},
        {key: 'D', value: 'Finalizado', color: 'secondary', icon: ''}
      ],
      finalizacionCalificacion: 0.0,
      finalizacionMensaje: null,
      message: '',
      open: false,
    };

    // Bindings.
    this.clearMessage = this.clearMessage.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.finalizar = this.finalizar.bind(this);
  }

  componentWillMount() {
    this.props.dispatch(obtenerProblema(this.state.problemId))
    .then((response) => {
      this.setState({ problemData: response[0] }, this.checkForSettledPresupuesto(response[0]));
    })
    .catch((err) => {
      const response = {
        error: true,
        message: err.data,
      };
      this.setState({ response });
      this.setState({ loading: false });
    });

    if (typeof this.state.user.idCliente !== 'undefined') {
      this.props.dispatch(obtenerPresupuestosDeProblema(this.state.problemId))
      .then((response) => {
        if (response) {
        this.setState({ presupuestos: response });
      } else {
        this.setState({ presupuestos: [] });
      }
      })
      .catch((err) => {
        const response = {
          error: true,
          message: err.data,
        };
        this.setState({ response });
        this.setState({ loading: false });
      });
    }
  }

  checkForSettledPresupuesto(respuesta) {
    if (respuesta.presupuesto) {
      this.setState({ presupuestoAceptado: respuesta.presupuesto });
    }
    if (respuesta.trabajo) {
      this.setState({ trabajo: respuesta.trabajo });
    }
  }

  clearMessage() {
    this.setState({ message: '' });
  }

  aceptarPresupuesto(idPresupuesto) {
    this.props.dispatch(aceptarLicitacion(idPresupuesto, this.state.problemId))
    .then((response) => {
      window.location.reload()
    })
    .catch((err) => {
      const response = {
        error: true,
        message: err.data,
      };
      this.setState({ response });
      this.setState({ loading: false });
    });
  }

  finalizarYCalificar() {
    this.setState({ open: true });
  }

  finalizar() {
    let trabajoEstado

    if (this.state.user.userType === 'user') {
      if (this.state.trabajo.estado === 'A') {
        trabajoEstado = 'B'
      } else if (this.state.trabajo.estado === 'C') {
        trabajoEstado = 'D'
      }
    } else if (this.state.user.userType === 'fixer') {
      if (this.state.trabajo.estado === 'A') {
        trabajoEstado = 'C'
      } else if (this.state.trabajo.estado === 'B') {
        trabajoEstado = 'D'
      }
    }

    const trabajo = { estado: trabajoEstado, idTrabajo: this.state.trabajo.idTrabajo}
    this.props.dispatch(cerrarProblema(trabajo))
    .then((response) => {
      const valoracion = {
        tipoValorado: this.state.user.userType === 'user' ? 'fixer' : 'user',
        calificacion: this.state.finalizacionCalificacion,
        detalle: this.state.finalizacionMensaje,
        idValorador: this.state.user.userType === 'user' ? this.state.user.idCliente : this.state.user.idProfesional,
        idValorado: this.state.user.userType === 'user' ? this.state.presupuestoAceptado.idProfesional : this.state.problemData.cliente.idCliente
      }

      this.props.dispatch(valorar(valoracion))
      .then((response) => window.location.reload())
      .catch((err) => {
        const response = {
          error: true,
          message: err.data,
        };
        this.setState({ response });
        this.setState({ loading: false });
      })
    })
    .catch((err) => {
      const response = {
        error: true,
        message: err.data,
      };
      this.setState({ response });
      this.setState({ loading: false });
    });
  }

  disableMarcarTerminado() {
    if (this.state.user.userType === 'user') {
      if (this.state.trabajo.estado === 'A' || this.state.trabajo.estado === 'C') {
        return true
      }
    } else {
      if (this.state.trabajo.estado === 'A' || this.state.trabajo.estado === 'B') {
        return true
      }
    }
    return false
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
    const { problemId, problemData, user, presupuestos, presupuestoAceptado, trabajo, estadosTrabajo,
      finalizacionCalificacion, finalizacionMensaje } = this.state;

    return (
      <main className={classes.layout}>
      {problemData &&
        <Grid container spacing={24}>

          {/* --- Problema --- */}
          <Grid item xs={12} md={12}>
            <Card>
                <CardHeader
                  title={this.state.problemData.titulo}
                  subheader={this.state.problemData.descripcion}
                  titleTypographyProps={{ align: 'center' }}
                  subheaderTypographyProps={{ align: 'center' }}
                  className={classes.cardHeader}
                />
              </Card>
          </Grid>

          {/* --- Presupuesto --- */}
          <Grid item xs={12} md={4}>
            <Card>
                <CardHeader
                  title="Rango Presupuestario"
                  subheader="Presupuesto dispuesto a pagar"
                  titleTypographyProps={{ align: 'center' }}
                  subheaderTypographyProps={{ align: 'center' }}
                  className={classes.cardHeader}
                />
                <CardContent>
                  <div className={classes.cardPricing}>
                    <Typography variant="display1" color="textPrimary" align="center">
                      MIN ${this.state.problemData.presupuestoMinimo}
                    </Typography>
                    <Typography variant="display1" color="textPrimary" align="center">
                      MAX ${this.state.problemData.presupuestoMaximo}
                    </Typography>
                  </div>
                </CardContent>
              </Card>
          </Grid>

          {/* --- Caracteristicas del Problema --- */}
          <Grid item xs={12} md={4}>
            <Card>
                <CardHeader
                  title="Otros Datos"
                  titleTypographyProps={{ align: 'center' }}
                  subheaderTypographyProps={{ align: 'center' }}
                  className={classes.cardHeader}
                />
                <CardContent>
                  <div className={classes.cardPricing}>
                  <Typography variant="title" color="textPrimary" align="center">
                      Zona: {this.state.problemData.zona}
                    </Typography>
                    <Typography variant="title" color="textPrimary" align="center">
                      Rubro: {this.state.problemData.rubro.descripcion}
                    </Typography>
                    <Typography variant="title" color="textPrimary" align="center">
                      Calificación Usuario: {this.state.problemData.cliente.calificacionPromedio.toFixed(1)}
                    </Typography>
                  </div>
                </CardContent>
              </Card>
          </Grid>

          {/* --- Licitar --- */}
          {user.idProfesional &&
            <Grid item xs={12} md={4}>
              <Card>
                  <CardHeader
                    title="Licitar"
                    subheader="Propone al Cliente un presupuesto"
                    titleTypographyProps={{ align: 'center' }}
                    subheaderTypographyProps={{ align: 'center' }}
                    className={classes.cardHeader}
                  />
                  <CardActions style={{justifyContent: 'center'}}>
                    <Button
                      disabled={presupuestoAceptado != null}
                      variant="raised" color="primary"size="small"
                      href={'/licitar/' + problemId}>Licitar</Button>
                  </CardActions>
                </Card>
            </Grid>
          }

          {user.idCliente && presupuestoAceptado == null && presupuestos.length > 0 &&
            <Grid item xs={12} md={12}>
            <Card>
                <CardHeader
                  title="Presupuesto Recibidos"
                  subheader="Estas son los presupuestos de los Fixers"
                  titleTypographyProps={{ align: 'center' }}
                  subheaderTypographyProps={{ align: 'center' }}
                  className={classes.cardHeader}
                />
                <hr></hr>
                <CardContent>
                  <div className={classes.cardPricing}>
                  {presupuestos.length > 0 && presupuestos.map((presupuesto, index) => {
                    return (
                      <div>
                        <Typography variant="title" color="textPrimary" align="center">
                          Propuesta: {presupuesto.observacion}
                        </Typography>
                        <Typography variant="title" color="textPrimary" align="center">
                          Valor: ${presupuesto.valor}
                        </Typography>
                        <Typography variant="title" color="textPrimary" align="center">
                          Cantidad de Dias: {presupuesto.cantJornadasLaborables}
                        </Typography>
                        <Typography variant="title" color="textPrimary" align="center">
                          Costos Variables (ej: materiales): ${presupuesto.valorMateriales}
                        </Typography>
                        <CardActions style={{justifyContent: 'center'}}>
                          <Button variant="raised" color="primary"size="small" onClick={() => {this.aceptarPresupuesto(presupuesto.idPresupuesto)}}>Aprobar</Button>
                        </CardActions>
                        <hr></hr>
                      </div>
                    );
                  })}
                  </div>
                </CardContent>
              </Card>
            </Grid>
          }

          {user.idCliente && presupuestoAceptado == null && presupuestos.length == 0 &&
            <Grid item xs={12} md={12}>
            <Card>
                <CardHeader
                  title="Presupuesto Recibidos"
                  subheader="Estas son las propuestos de los Fixers"
                  titleTypographyProps={{ align: 'center' }}
                  subheaderTypographyProps={{ align: 'center' }}
                  className={classes.cardHeader}
                />
                <hr></hr>
                <CardContent>
                  <div className={classes.cardPricing}>
                    <Typography variant="title" color="textPrimary" align="center">
                      Todavia no hay propuestas :(
                    </Typography>
                  </div>
                </CardContent>
              </Card>
            </Grid>
          }

          {presupuestoAceptado != null && ((user.idProfesional  &&
              user.idProfesional === presupuestoAceptado.idProfesional) || user.idCliente) &&
            <Grid item xs={12} md={12}>
            <Card>
                <CardHeader
                  title="Presupuesto Asignado"
                  subheader="Este es el presupuesto asignado"
                  titleTypographyProps={{ align: 'center' }}
                  subheaderTypographyProps={{ align: 'center' }}
                  className={classes.cardHeader}
                />
                <hr></hr>
                <CardContent>
                  <div className={classes.cardPricing}>
                    <Chip
                      label={estadosTrabajo.find(o => o.key === trabajo.estado).value}
                      className={classes.chip}
                      color={estadosTrabajo.find(o => o.key === trabajo.estado).color}
                      deleteIcon={<DoneIcon />}
                      variant="outlined"
                    />
                    <Typography variant="title" color="textPrimary" align="center">
                      Propuesta: {presupuestoAceptado.observacion}
                    </Typography>
                    <Typography variant="title" color="textPrimary" align="center">
                      Valor ${presupuestoAceptado.valor}
                    </Typography>
                    <Typography variant="title" color="textPrimary" align="center">
                      Cantidad de Dias {presupuestoAceptado.cantJornadasLaborables}
                    </Typography>
                    <Typography variant="title" color="textPrimary" align="center">
                      Costos Variables (ej: materiales) ${presupuestoAceptado.valorMateriales}
                    </Typography>
                    <CardActions style={{justifyContent: 'center'}}>
                          <Button 
                            variant="raised"
                            color="primary"
                            size="small"
                            disabled={!this.disableMarcarTerminado()}
                            onClick={() => {this.finalizarYCalificar()}}>Marcar Terminado</Button>
                    </CardActions>
                  </div>
                </CardContent>
              </Card>
            </Grid>
          }

          <Dialog open={this.state.open} onClose={this.handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Calificación del Trabajo</DialogTitle>
            <DialogContent>
              {user.idProfesional && 
                <DialogContentText>
                  Ingresa una calificacion entre 1 y 10 para el Cliente y una breve reseña sobre como te sentiste al trabajar
                </DialogContentText>
              }
              {user.idCliente && 
                <DialogContentText>
                  Ingresa una calificacion entre 1 y 10 para el Fixer y una breve reseña sobre su trabajo
                </DialogContentText>
              }
              <TextField autoFocus margin="dense" name="finalizacionCalificacion"
                label="Calificaicon" type="text" value={finalizacionCalificacion}
                onChange={this.handleChange} fullWidth />
              <TextField autoFocus margin="dense" name="finalizacionMensaje"
                label="Reseña" type="text" value={finalizacionMensaje}
                onChange={this.handleChange} fullWidth />
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleClose} color="primary">
                Cancelar
              </Button>
              <Button onClick={this.finalizar} color="primary">
                Finalizar
              </Button>
            </DialogActions>
          </Dialog>

          {/* --- Fotos-Videos ---
          <Grid item xs={12} md={8}>
            <Carousel width="750px" showThumbs={false} showStatus={false} autoPlay={true} infiniteLoop={true}>
              {this.state.problemData.problemImages.map((imagePath, index) => {
                return (
                  <div>
                    <img src={imagePath} />
                  </div>
                );
              })}
            </Carousel>
          </Grid> */}

        </Grid>
      }
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
  },
  chip: {
    margin: theme.spacing.unit,
  },
});

const mapStateToProps = state => ({
  isAuthenticated: state.Auth.isAuthenticated,
  user: state.Auth.user,
});

export default connect(mapStateToProps)(withStyles(styles)(Problema));