import { SET_SPRINTS } from './action';

import { firebaseValueToArr } from '../../utils';

import { getActionMapThunk } from '../app/thunk';

export const getSprintsThunk = () => async (dispatch, getState, getFirebase) => {
  const auth = getState().firebase.auth;
  const snapshot = await getFirebase()
    .ref('/sprints')
    .orderByChild('owner')
    .equalTo(auth.uid)
    .once('value');
  const value = snapshot.val();

  dispatch(SET_SPRINTS(firebaseValueToArr(value)));
  dispatch(getActionMapThunk());
};

export const addDirectionToSprintThunk = (dirUid) => async (dispatch, getState, getFirebase) => {
  const user = getState().app.user;
  const sprints = getState().sprints;
  const lastSprintKey = sprints[sprints.length - 1].uid;

  await getFirebase()
    .ref(`/sprints/${lastSprintKey}/direction/${dirUid}`)
    .set(new Array(user.settings.actionsCount).fill(''));
  dispatch(getSprintsThunk());
  dispatch(getActionMapThunk());
};

export const updateSprintActionThunk = (sprintKey, directionKey, actionIndex, value) => async (dispatch, getState, getFirebase) => {
  await getFirebase().update(`/sprints/${sprintKey}/direction/${directionKey}`, { [actionIndex]: value });
  dispatch(getActionMapThunk());
};
