import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

import { getFirebaseConfig } from '../utils';
import rootReducer from './reducer';
import initialState from './initialState';

const rrfConfig = {
  userProfile: 'users'
};

firebase.initializeApp(getFirebaseConfig());

const middlewares = [
  thunk
];

function getEnhancer() {
  return composeWithDevTools(applyMiddleware(...middlewares));
}

export const store = createStore(
  rootReducer,
  initialState,
  getEnhancer(),
);

export const rrfProps = {
  firebase,
  config: rrfConfig,
  dispatch: store.dispatch,
};
