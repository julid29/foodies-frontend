import { applyMiddleware, createStore, compose } from 'redux';
import { persistStore } from 'redux-persist';
import logger from 'redux-logger';
import ReduxThunk from 'redux-thunk';
import RootReducer from './reducers';

const store = createStore(
  RootReducer,
  compose(applyMiddleware(ReduxThunk, logger)),
);

persistStore(store);

export default store;
