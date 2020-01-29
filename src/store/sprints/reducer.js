import { handleActions } from 'redux-actions';

import initialState from '../initialState';

import {
  SET_SPRINTS,
} from './action';

export default handleActions({
  [SET_SPRINTS]: (state, action) => action.payload,
}, initialState.sprints);
