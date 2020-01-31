import { handleActions } from 'redux-actions';

import initialState from '../initialState';

import {
  SET_DIRECTIONS_MAP,
  SET_USER,
  SET_ACTIONS_MAP,
} from './action';

export default handleActions({
  [SET_USER]: (state, action) => ({ ...state, user: action.payload }),
  [SET_DIRECTIONS_MAP]: (state, action) => ({ ...state, directionsMap: action.payload || {} }),
  [SET_ACTIONS_MAP]: (state, action) => ({ ...state, actionsMap: action.payload || {} }),
}, initialState.app);
