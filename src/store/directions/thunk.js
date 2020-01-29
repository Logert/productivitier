import { SET_DIRECTIONS } from './action';

import { firebaseValueToArr } from '../../utils';

import { addDirectionToSprintThunk } from '../sprints/thunk';

export const getDirectionsThunk = () => async (dispatch, getState, getFirebase) => {
  const auth = getState().firebase.auth;
  const snapshot = await getFirebase()
    .ref('/directions')
    .orderByChild('owner')
    .equalTo(auth.uid)
    .once('value');
  const value = snapshot.val();

  dispatch(SET_DIRECTIONS(firebaseValueToArr(value).filter(d => d.state === 'ACTIVE')));
};

export const addDirectionThunk = ({ img, name, description, onSuccess }) => async (dispatch, getState, getFirebase) => {
  const auth = getState().firebase.auth;
  const dirUid = await getFirebase()
    .ref('/directions')
    .push({ img, name, description, owner: auth.uid, state: 'ACTIVE' })
    .key;

  if (dirUid) {
    dispatch(addDirectionToSprintThunk(dirUid));
    onSuccess();
  }
  dispatch(getDirectionsThunk());
};

export const removeDirectionThunk = (uid) => async (dispatch, getState, getFirebase) => {
  await getFirebase()
    .ref(`/directions/${uid}`)
    .update({ state: 'REMOVED' });

  dispatch(getDirectionsThunk());
};

export const updateDirectionThunk = (uid, data, onSuccess) => async (dispatch, getState, getFirebase) => {
  await getFirebase()
    .ref(`/directions/${uid}`)
    .update(data);
  onSuccess();
  dispatch(getDirectionsThunk());
};
