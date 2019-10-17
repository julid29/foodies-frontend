import Home from '../pages/Home';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import Register from '../pages/Register';
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';
import Problemas from '../pages/Problemas';
import Problema from '../pages/Problema';
import Profile from '../pages/Profile';
import NoMatch from '../pages/NoMatch';
import Licitacion from '../pages/Licitacion';
import PublicarProblema from '../pages/PublicarProblema';
import Profesiones from '../pages/Profesiones';

const routes = [
  {
    path: '/',
    exact: true,
    auth: true,
    component: Dashboard,
    fallback: Home,
  },
  {
    path: '/login',
    exact: true,
    auth: false,
    component: Login,
  },
  {
    path: '/register',
    exact: true,
    auth: false,
    component: Register,
  },
  {
    path: '/forgot-password',
    exact: true,
    auth: false,
    component: ForgotPassword,
  },
  {
    path: '/reset-password',
    exact: true,
    auth: false,
    component: ResetPassword,
  },
  {
    path: '/profile',
    exact: true,
    auth: true,
    component: Profile,
  },
  {
    path: '/problemas',
    exact: true,
    auth: true,
    component: Problemas,
  },
  {
    path: '/problema/:id',
    exact: true,
    auth: true,
    component: Problema,
  },
  {
    path: '/licitar/:problemaId',
    exact: true,
    auth: true,
    component: Licitacion,
  },
  {
    path: '/publicarProblema',
    exact: true,
    auth: true,
    component: PublicarProblema,
  },
  {
    path: '/professions',
    exact: true,
    auth: true,
    component: Profesiones,
  },
  {
    path: '',
    exact: false,
    auth: true,
    component: NoMatch,
  },
];

export default routes;
