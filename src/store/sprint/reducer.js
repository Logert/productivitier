import { handleActions } from 'redux-actions';

import initialState from '../initialState';

import { createDirectionMap } from '../../utils';

import {
  ADD_SPRINT,
  UPDATE_SPRINT_ACTION,
  UPDATE_DIRECTIONS_SPRINT,
} from './action';

export default handleActions({
  [UPDATE_SPRINT_ACTION]: (state, { payload: { sprintIndex, directionId, actionIndex, actionValue } }) => {
    const newState = [ ...state ];
    newState[sprintIndex].direction[directionId][actionIndex] = actionValue;
    return newState;
  },
  [ADD_SPRINT]: (state, { payload: { date, direction, actions } }) => {
    const newState = [ ...state ];
    newState.push({ date, direction: createDirectionMap(direction, actions) });
    return newState;
  },
  [UPDATE_DIRECTIONS_SPRINT]: (state) => {
    const newState = [ ...state ];
    const sprintIndex = state.length - 1;
    const currentSprintDirections = newState[sprintIndex].direction;
    const lastDirectionId = Object.keys(currentSprintDirections).length;
    const countActions = currentSprintDirections[0].length || 3;
    newState[sprintIndex].direction[lastDirectionId] = new Array(countActions).fill('');
    return newState;
  },
}, initialState.sprint);
