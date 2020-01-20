import { combineReducers } from 'redux';

import auth from './auth/reducer';
import directions from './directions/reducer';
import sprint from './sprint/reducer';

export default combineReducers({
  auth,
  directions,
  sprint,
});
