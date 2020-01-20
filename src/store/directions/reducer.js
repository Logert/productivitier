import { handleActions } from 'redux-actions';

import initialState from '../initialState';

import {
  ADD_DIRECTION,
} from './action';

export default handleActions({
  [ADD_DIRECTION]: (state, { payload: { name, description } }) => {
    const newState = [...state];
    newState.push({
      id: state.length,
      img: 'programming.jpg',
      name,
      description
    });
    return newState;
  },
}, initialState.directions);
