import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import dataService from '../services'
// Material Components
import { withStyles } from '@material-ui/core/styles/';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';

import { obtenerPosiblesProblemasDeProfesional, obtenerProblemasDeCliente, obtenerProblemasActivos } from '../services/dataService';

class Dashboard extends Component {
  
  constructor(props) {
    super(props);
    document.title = 'Foodies';
    
    // Initial state.
    this.state = {
      loading: false, 
      user: props.user,
      ingredientes: [
        {
          titulo: "Chocolate",
          calorias: "546 c/ 100gr",
          cantRecetas: 5733,
          objSubir: 5378,
          objBajar: 355
        },
        {
          titulo: "Vainilla",
          calorias: "288 c/ 100gr",
          cantRecetas: 753,
          objSubir: 523,
          objBajar: 230
        },
        {
          titulo: "Tomate",
          calorias: "35 c/ 150gr",
          cantRecetas: 100,
          objSubir: 35,
          objBajar: 65
        },
        {
          titulo: "Rabano",
          calorias: "15.77 c/ 100gr",
          cantRecetas: 132,
          objSubir: 57,
          objBajar: 75
        },
        {
          titulo: "Harina de Trigo",
          calorias: "364 c/ 100gr",
          cantRecetas: 2344,
          objSubir: 1402,
          objBajar: 942
        },
        {
          titulo: "Harina de Soja",
          calorias: "421 c/ 100gr",
          cantRecetas: 109,
          objSubir: 63,
          objBajar: 46
        },
      ]
    };
  }

  // componentWillMount() {
  //   this.props.dispatch(obtenerProblemasDeCliente(this.state.user.idCliente))
  //   .then((response) => {
  //     this.setState({ problemas: response });
  //   })
  //   .catch((err) => {
  //     const response = {
  //       error: true,
  //       message: err.data,
  //     };
  //     this.setState({ response });
  //     this.setState({ loading: false });
  //   });
  // }

  render() {
    const { classes } = this.props;
    const { user, ingredientes } = this.state;

    return (
      <main className={classes.layout}>
        <Grid container spacing={24}>
          {ingredientes.length > 0 && ingredientes.map((ingrediente, index) => {
            return (
            <Grid item xs={12} md={6} spacing={3}>
              <Card>
                <CardHeader
                  title={ingrediente.titulo}
                  subheader={ingrediente.calorias}
                  titleTypographyProps={{ align: 'center', variant: 'display3' }}
                  subheaderTypographyProps={{ align: 'center' }}
                  className={classes.cardHeader}
                />
                <CardContent>
                  <div className={classes.cardPricing}>
                    <Typography variant="display2" color="textPrimary" align="center">
                      Recetas: {ingrediente.cantRecetas}
                    </Typography>
                    <Typography variant="body1" color="textPrimary" align="left">
                      Ayudan a Bajar: {ingrediente.objBajar}
                    </Typography>
                    <Typography variant="body1" color="textPrimary" align="left">
                      Ayudan a Subir: {ingrediente.objSubir}
                    </Typography>
                  </div>
                </CardContent>
                <CardActions style={{justifyContent: 'center'}}>
                  <Button variant="raised" color="primary"size="small" href={"/recetas?ingredientes=" + ingrediente.titulo}>Ver Recetas</Button>
                </CardActions>
              </Card>
            </Grid>);
          })}
        </Grid>
      </main>
    );

  }

}

const styles = theme => ({
  pageTitle: {
    marginBottom: theme.spacing.unit * 3,
  },
  connect: {
    marginBottom: theme.spacing.unit * 3,
  }
});

const mapStateToProps = state => ({
  isAuthenticated: state.Auth.isAuthenticated,
  user: state.Auth.user,
});

export default connect(mapStateToProps)(withStyles(styles)(Dashboard));