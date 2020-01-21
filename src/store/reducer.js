import { combineReducers } from 'redux';
import { firebaseReducer } from 'react-redux-firebase';

import directions from './directions/reducer';
import sprint from './sprint/reducer';

export default combineReducers({
  firebase: firebaseReducer,
  directions,
  sprint,
});
