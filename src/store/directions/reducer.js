import { handleActions } from 'redux-actions';

import initialState from '../initialState';

import {
  SET_DIRECTIONS,
} from './action';

export default handleActions({
  [SET_DIRECTIONS]: (state, action) => action.payload,
}, initialState.directions);
