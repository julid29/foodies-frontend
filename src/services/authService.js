import Http from '../Http';
import * as action from '../store/actions';

const apiBase = 'http://localhost:3030/';

export function login(credentials) {
  return dispatch => (
    new Promise((resolve, reject) => {
      Http.post(apiBase + 'usuarios/login', credentials)
        .then((res) => {
          // We need to set auth headers before hydrating user data.
          const { token } = res.data;
          const accessToken = token.replace('Bearer ', '');
          Http.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

          dispatch(action.authLogin(res.data));
          return resolve();
        })
        .catch((err) => {
          console.log(err);
          const { response = { status: 403 } } = err;
          const { status } = response;
          let errors = ['Credenciales invalidas'];
          if (status === 401) {
            errors = ['Authorization failed'];
          }
          const data = {
            status,
            errors,
          };
          return reject(data);
        });
    })
  );
}

export function register(registerData) {
  return dispatch => (
    new Promise((resolve, reject) => {
      Http.post(apiBase + 'usuarios', registerData)
        .then(res => resolve(res.data))
        .catch((err) => {
          const error = err.error;
          return reject(error);
        });
    })
  );
}

//////////////////////////////////////////////////////////

export function retrieveUser(userType, nroFiscal) {
  if (userType === 'user') {
    return dispatch => (
      new Promise((resolve, reject) => {
        Http.get(apiBase + 'actionClientes?nroFiscal=' + nroFiscal)
          .then(res => {
            dispatch(action.reloadUser(res.data));
            return resolve();
          })
          .catch((err) => {
            const error = err.error;
            return reject(error);
          });
      })
    );
  } else {
    return dispatch => (
      new Promise((resolve, reject) => {
        Http.get(apiBase + 'actionProfesionales?nroFiscal=' + nroFiscal)
        .then(res => {
          dispatch(action.reloadUser(res.data));
          return resolve();
        })
          .catch((err) => {
            const error = err.error;
            return reject(error);
          });
      })
    );
  }
}

export function checkData(userType, dataToCheck, dataValue) {
  if (userType === 'user') {
    return dispatch => (
      new Promise((resolve, reject) => {
        Http.get(apiBase + 'actionClientes?' + dataToCheck + '=' + dataValue)
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
        Http.get(apiBase + 'actionProfesionales?' + dataToCheck + '=' + dataValue)
          .then(res => resolve(res.data))
          .catch((err) => {
            const error = err.error;
            return reject(error);
          });
      })
    );
  }
}

export function resetPassword(credentials) {
  return dispatch => (
    new Promise((resolve, reject) => {
      Http.post(apiBase + '/api/v1/auth/forgot-password', credentials)
        .then(res => resolve(res.data))
        .catch((err) => {
          const { status, errors } = err.response.data;
          const data = {
            status,
            errors,
          };
          return reject(data);
        });
    })
  );
}

export function updatePassword(credentials) {
  return dispatch => (
    new Promise((resolve, reject) => {
      Http.post(apiBase + '/api/v1/auth/password-reset', credentials)
        .then((res) => {
          const { status } = res.data.status;
          if (status === 202) {
            const data = {
              error: res.data.message,
              status,
            };
            return reject(data);
          }
          return resolve(res);
        })
        .catch((err) => {
          const { status, errors } = err.response.data;
          const data = {
            status,
            errors,
          };
          return reject(data);
        });
    })
  );
}
