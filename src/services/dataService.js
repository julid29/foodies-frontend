import Http from '../Http';
import { func } from 'prop-types';

const apiBase = 'http://localhost:3030/';

// PROFILES
export function actualizarUsuario(userType, newUserData) {
  if (userType === 'user') {
    return dispatch => (
      new Promise((resolve, reject) => {
        Http.put(apiBase + 'actionClientes', newUserData)
          .then(res => resolve(res.data))
          .catch((err) => {
            const error = err.error;
            return reject(error);
          });
      })
    );
  } else {
    return dispatch => (
      new Promise((resolve, reject) => {
        Http.put(apiBase + 'actionProfesionales', newUserData)
          .then(res => resolve(res.data))
          .catch((err) => {
            const error = err.error;
            return reject(error);
          });
      })
    );
  }
}

export function verificarCierreCuenta(userType, user) {
  if (userType === 'user') {
    return dispatch => (
      new Promise((resolve, reject) => {
        Http.get(apiBase + 'actionClientes?idClienteCierre=' + user.idCliente)
          .then(res => resolve(res.data))
          .catch((err) => {
            const error = err.error;
            return reject(error);
          });
      })
    );
  } else {
    return dispatch => (
      new Promise((resolve, reject) => {
        Http.get(apiBase + 'actionProfesionales?idProfesionalCierre=' + user.idProfesional)
          .then(res => resolve(res.data))
          .catch((err) => {
            const error = err.error;
            return reject(error);
          });
      })
    );
  }
}

export function darDeBajaCuenta(userType, user) {
  if (userType === 'user') {
    return dispatch => (
      new Promise((resolve, reject) => {
        Http.get(apiBase + 'actionClientes?idClienteEliminar=' + user.idCliente)
          .then(res => resolve(res.data))
          .catch((err) => {
            const error = err.error;
            return reject(error);
          });
      })
    );
  } else {
    return dispatch => (
      new Promise((resolve, reject) => {
        Http.get(apiBase + 'actionProfesionales?idProfesionalEliminar=' + user.idProfesional)
          .then(res => resolve(res.data))
          .catch((err) => {
            const error = err.error;
            return reject(error);
          });
      })
    );
  }
}

export function obtenerProblemasActivos(userType, user) {
  if (userType === 'user') {
    return dispatch => (
      new Promise((resolve, reject) => {
        Http.get(apiBase + 'actionClientes?idClienteProblemasActivos=' + user.idCliente)
          .then(res => resolve(res.data))
          .catch((err) => {
            const error = err.error;
            return reject(error);
          });
      })
    );
  } else {
    return dispatch => (
      new Promise((resolve, reject) => {
        Http.get(apiBase + 'actionProfesionales?idProfesionalProblemasActivos=' + user.idProfesional)
          .then(res => resolve(res.data))
          .catch((err) => {
            const error = err.error;
            return reject(error);
          });
      })
    );
  }
}

// PROBLEMAS
export function publicar(publicacion) {
  return dispatch => (
    new Promise((resolve, reject) => {
      Http.post(apiBase + 'actionProblemas', publicacion)
        .then((res) => {
          return resolve(res.data);
        })
        .catch((err) => {
          return reject(err.response);
        });
    })
  );
}

export function obtenerProblema(idProblema) {
  return dispatch => (
    new Promise((resolve, reject) => {
      Http.get(apiBase + 'actionProblemas?problemaId=' + idProblema)
        .then((res) => {
          return resolve(res.data);
        })
        .catch((err) => {
          return reject(err.response);
        });
    })
  );
}

export function obtenerProblemasTodos() {
  return dispatch => (
    new Promise((resolve, reject) => {
      Http.get(apiBase + 'actionProblemas')
        .then((res) => {
          return resolve(res.data);
        })
        .catch((err) => {
          return reject(err.response);
        });
    })
  );
}

export function obtenerProblemasDeCliente(idCliente) {
  return dispatch => (
    new Promise((resolve, reject) => {
      Http.get(apiBase + 'actionProblemas?clienteId=' + idCliente)
        .then((res) => {
          return resolve(res.data);
        })
        .catch((err) => {
          return reject(err.response);
        });
    })
  );
}

export function obtenerProblemasDeProfesional(idProfesional) {
  return dispatch => (
    new Promise((resolve, reject) => {
      Http.get(apiBase + 'actionProblemas?idProfesional=' + idProfesional)
        .then((res) => {
          return resolve(res.data);
        })
        .catch((err) => {
          return reject(err.response);
        });
    })
  );
}

export function obtenerPosiblesProblemasDeProfesional(idProfesional) {
  return dispatch => (
    new Promise((resolve, reject) => {
      Http.get(apiBase + 'actionProblemas?idProfesionalPosibles=' + idProfesional)
        .then((res) => {
          return resolve(res.data);
        })
        .catch((err) => {
          return reject(err.response);
        });
    })
  );
}

export function cerrarProblema(problemData) {
  return dispatch => (
    new Promise((resolve, reject) => {
      Http.put(apiBase + 'actionProblemas', problemData)
        .then((response) => {
          return resolve(response);
        })
        .catch((error) => {
          console.log(error);
          return reject(error);
        });
    })
  );
}

// PRESUPUESTOS
export function licitar(licitacion) {
  return dispatch => (
    new Promise((resolve, reject) => {
      Http.post(apiBase + 'actionPresupuestos', licitacion)
        .then((response) => {
          return resolve(response);
        })
        .catch((error) => {
          console.log(error);
          return reject(error);
        });
    })
  );
}

export function aceptarLicitacion(idPresupuesto, problemId) {
  return dispatch => (
    new Promise((resolve, reject) => {
      Http.put(apiBase + 'actionPresupuestos', {"idPresupuesto": idPresupuesto, "idProblema": problemId})
        .then((response) => {
          return resolve(response);
        })
        .catch((error) => {
          console.log(error);
          return reject(error);
        });
    })
  );
}

export function obtenerPresupuestosDeProblema(idProblema) {
  return dispatch => (
    new Promise((resolve, reject) => {
      Http.get(apiBase + 'actionPresupuestos?problemaId=' + idProblema)
        .then((res) => {
          return resolve(res.data);
        })
        .catch((err) => {
          return reject(err.response);
        });
    })
  );
}

// PROFESIONES
export function obtenerProfesiones() {
  return dispatch => (
    new Promise((resolve, reject) => {
      Http.get(apiBase + 'actionRubros')
        .then((res) => {
          return resolve(res.data);
        })
        .catch((err) => {
          return reject(err.response);
        });
    })
  );
}

export function obtenerProfesionesDeProfesional(idProfesional) {
  return dispatch => (
    new Promise((resolve, reject) => {
      Http.get(apiBase + 'actionRubros?idProfesional=' + idProfesional)
        .then((res) => {
          return resolve(res.data);
        })
        .catch((err) => {
          return reject(err.response);
        });
    })
  );
}

export function agregarProfesionAProfesional(idProfesional, idRubro, matricula) {
  return dispatch => (
    new Promise((resolve, reject) => {
      Http.post(apiBase + 'actionRubros', {idProfesional: idProfesional, idRubro: idRubro, matricula: matricula})
        .then((res) => {
          return resolve(res.data);
        })
        .catch((err) => {
          return reject(err.response);
        });
    })
  );
}

export function quitarProfesionAProfesional(idProfesional, idRubro) {
  return dispatch => (
    new Promise((resolve, reject) => {
      Http.delete(apiBase + 'actionRubros?idProfesional=' + idProfesional + '&idRubro=' +idRubro)
        .then((res) => {
          return resolve(res.data);
        })
        .catch((err) => {
          return reject(err.response);
        });
    })
  );
}

// VALORACIONES
export function valorar(valoracion) {
  return dispatch => (
    new Promise((resolve, reject) => {
      Http.post(apiBase + 'actionValoraciones', valoracion)
        .then((response) => {
          return resolve(response);
        })
        .catch((error) => {
          console.log(error);
          return reject(error);
        });
    })
  );
}
