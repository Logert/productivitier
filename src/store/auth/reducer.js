import { handleActions } from 'redux-actions';

import initialState from '../initialState';

import {
  LOGIN,
} from './action';

export default handleActions({
  [LOGIN]: state => state,
}, initialState.auth);
