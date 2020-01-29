import { combineReducers } from 'redux';
import { firebaseReducer } from 'react-redux-firebase';

import app from './app/reducer';
import directions from './directions/reducer';
import sprints from './sprints/reducer';

export default combineReducers({
  firebase: firebaseReducer,
  app,
  directions,
  sprints,
});
