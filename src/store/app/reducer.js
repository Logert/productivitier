import { handleActions } from 'redux-actions';

import initialState from '../initialState';

import {
  SET_DIRECTIONS_MAP,
  SET_USER,
} from './action';

export default handleActions({
  [SET_USER]: (state, action) => ({ ...state, user: action.payload }),
  [SET_DIRECTIONS_MAP]: (state, action) => ({ ...state, directionsMap: action.payload || {} }),
}, initialState.app);
